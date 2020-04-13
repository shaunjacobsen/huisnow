// on invoke...
// call scraper api
// save each result

import axios from 'axios';

const apiUrl = 'http://localhost:4000/properties';
const scraperUrl = 'http://localhost:4001';

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

  return axios.post(`${apiUrl}/`, data);
}

function saveResults(results: any) {
  if (results && results.data && results.data.data) {
    if (!Array.isArray(results.data.data)) return;

    // now do a request to save each result
    results.data.data.reduce((p: Promise<any>, result: any) => {
      return p
        .then((_) => requestCreate(result))
        .catch((e) => console.log('err', e));
    }, Promise.resolve());
  }
}

(async () => {
  try {
    const results = await axios.get(`${scraperUrl}/run`, {
      params: {
        search_url:
          'https://www.pararius.nl/huurwoningen/amsterdam/0-1600/50m2/2-slaapkamers',
      },
    });

    saveResults(results);

    // NEXT: needs to go to the next page and loop until it's done


  } catch (e) {
    console.log(e);
  }
})();
