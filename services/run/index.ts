import axios from 'axios';

const apiUrl = process.env.API_URL || 'http://localhost:4000/properties';
const scraperUrl = process.env.SCRAPER_URL || 'http://localhost:4001';

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
  };

  console.log(
    'Attempting to create entry\nSource: ',
    data.source,
    'Identifier: ',
    data.sourceIdentifier,
  );
  return axios.post(`${apiUrl}/`, data);
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
      .then(_ => requestCreate(result))
      .catch(e => {
        if (e.response?.data?.error === 'not_unique') notUnique.push(result);
        console.log('Error saving entry', result);
        errors.push(e);
      });
  }, Promise.resolve());

  return process.then(() => {
    console.log('Processing complete!');
    return { errors, notUnique };
  });
}

async function fetchResults(url: string) {
  const response = await axios.get(`${scraperUrl}/run`, {
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
          console.log('not unique count is ', notUniqueCount);
        }

        if (!data.nextPage) {
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
  const url = event.Records[0].Sns.Message;
  console.log('SNS message: ', url);
  await run(url);
};

// for development
const searchURL = process.env.SEARCH_URL;
if (process.env.NODE_ENV === 'development' && !!searchURL) {
  (async () => {
    await run(searchURL);
  })();
}
