import axios from 'axios';

import redisClient from './redis';

require('dotenv').config();

const apiUrl = process.env.API_URL || 'http://localhost:4000';
const scraperUrl = process.env.SCRAPER_URL || 'http://localhost:4001';

const SOURCE = 'pararius';

function savePropertyToRedis(result: any) {
  redisClient.set(
    `property:${SOURCE}:${result.propertyId}`,
    'true',
    (err, reply) => {
      if (err) console.log('error saving to redis', err);
    },
  );
}

function requestCreate(property: any) {
  const data = {
    source: 'pararius',
    sourceIdentifier: property.propertyId,
    name: property.title,
    postcode: property.postcode,
    municipality: property.municipality,
    agent: property.agent,
    price: property.price,
    surface: property.surface,
    images: property.images,
    availableFrom: property.availableFrom,
    constructionYear: property.constructionYear,
    url: property.url,
  };

  console.log(
    'Attempting to create entry\nSource: ',
    data.source,
    'Identifier: ',
    data.sourceIdentifier,
    'URL: ',
    data.url,
  );
  return new Promise((resolve, reject) =>
    axios
      .post(`${apiUrl}/properties`, data)
      .then(() => {
        savePropertyToRedis(property);
      })
      .catch(reject)
      .finally(resolve),
  );
}

interface SaveResultsResponse {
  errors: Error[];
  notUnique: any[];
}

async function saveResults(results: any[]): Promise<SaveResultsResponse> {
  if (!Array.isArray(results) || results.length < 1) return;

  const errors: Error[] = [];
  const notUnique: any[] = [];

  // now do a request to save each result
  const process = results.reduce((p: Promise<any>, result: any) => {
    return p
      .then(_ => {
        return new Promise((resolve, reject) => {
          redisClient.get(
            `property:${SOURCE}:${result.propertyId}`,
            (err, reply) => {
              if (err) reject('redis error');
              if (!!reply) {
                notUnique.push(result);
                return resolve();
              } else {
                requestCreate(result).then(resolve).catch(reject);
              }
            },
          );
        });
      })
      .catch(e => {
        if (e.response?.data?.error === 'not_unique') {
          console.log('Entry not unique', result.propertyId, result.url);
          // if the result is already in the db, save it in redis
          // so we don't try to save it next time
          savePropertyToRedis(result);
          return notUnique.push(result);
        }
        console.log('Error saving entry', result);
        errors.push(e);
      });
  }, Promise.resolve());

  return process.then(() => {
    console.log('Page complete!');
    return { errors, notUnique };
  });
}

async function fetchResults(url: string) {
  const response = await axios.get(`${scraperUrl}/search`, {
    params: {
      search_url: url,
    },
  });

  return response?.data;
}

async function run(url: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    if (!url) {
      console.log('No search URL specified');
      return reject('No search URL specified');
    }

    try {
      let notUniqueCount = 0;
      let page = url;

      while (notUniqueCount < 3) {
        const data = await fetchResults(page);
        const results = data?.data || [];
        page = data.nextPage;

        const { errors, notUnique } = await saveResults(results);

        if (notUnique.length > 0) {
          notUniqueCount += notUnique.length;
          console.log('Not unique count is ', notUniqueCount);
        }

        if (!data.nextPage || notUniqueCount >= 3) {
          console.log('No further pages. Exiting...');
          resolve('No further pages');
          break;
        }
      }

      resolve('Encountered 3 or more non-unique results. Exiting...');
    } catch (e) {
      console.log(e);
    }
  });
}

// for AWS Lambda
exports.handler = async function (event: any, context: any) {
  // uses a cloudwatch event with a simple json payload
  console.log('event', event);
  const { url } = event;
  await run(url);
};

// for development
const searchURL = process.env.SEARCH_URL;
if (process.env.NODE_ENV === 'development' && !!searchURL) {
  (async () => {
    await run(searchURL);
  })();
}
