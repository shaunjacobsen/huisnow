import * as cheerio from 'cheerio';
import axios from 'axios';
import srcset from 'srcset';
import { PropertyData } from './types';

const axiosInstance = axios.create({ baseURL: 'https://www.pararius.nl' });

function strip(text: string): string {
  return text.replace('\n', '').replace(/\n\s+/g, ' ').trim();
}

// async function run() {
//   let shouldRun = true;
//   let pageUrl =
//     'https://www.pararius.nl/huurwoningen/amsterdam/0-1600/50m2/2-slaapkamers';
//   while (shouldRun) {
//     try {
//       const { data, nextPage } = await crawl(pageUrl);
//       pageUrl = nextPage;
//       shouldRun = !!nextPage;
//       console.log(data, pageUrl);
//     } catch (e) {
//       console.error('RUN ERROR', e);
//     }
//   }
// }

interface CrawlData {
  data: PropertyData[];
  nextPage: string;
}

async function processListing(listing: PropertyData): Promise<PropertyData> {
  const listingPage = await axiosInstance.get(listing.url);
  const $ = cheerio.load(listingPage.data);

  const images: string[] = [];

  // grab list of images
  $('.carrousel .carrousel__item').each((i, e) => {
    const sources = $(e).find('source').attr('srcset');
    if (!sources) return;
    const img = srcset.parse(sources);
    const image = img.pop().url;
    images.push(image);
  });

  // title
  const title = strip($('h1.listing-detail-summary__title').text());

  // type
  const type = strip($('.listing-features__description--dwelling_type').text());

  // price
  const price = Number(
    $('.listing-detail-summary__price meta[itemprop=price]').attr('content'),
  );

  // location
  const _location = strip($('.listing-detail-summary__location').text());
  const location = _location.match(
    /(?<postcode>\d{4} \w{2}) (?<municipality>[\w].+)/,
  );
  const {
    groups: { postcode, municipality },
  } = location;

  // agent
  const agent = strip(
    $('.page__agent-summary-aside .agent-summary__title').text(),
  );

  // move-in date
  const dateAvailableRegex = new RegExp(/\d{1,2}-\d{1,2}-\d{4}/);
  let _dateAvailable: string | RegExpExecArray = strip(
    $('.listing-features__description--acceptance').text(),
  );
  _dateAvailable = dateAvailableRegex.exec(_dateAvailable) || '?';
  const dateAvailable = _dateAvailable ? _dateAvailable[0] : '?';

  // coordinates on map
  const latitude: number = Number(
    $('.listing-detail-map').data('listing-detail-map-latitude'),
  );
  const longitude: number = Number(
    $('.listing-detail-map').data('listing-detail-map-longitude'),
  );

  return {
    ...listing,
    title,
    images,
    type,
    agent,
    dateAvailable,
    coords: [latitude, longitude],
    postcode,
    municipality,
    price,
  };
}

export async function crawl(url: string): Promise<CrawlData> {
  const page = await axiosInstance.get(url, {});
  const $ = cheerio.load(page.data);
  // const totalResults = $('.search-results-container .count')
  //   .text()
  //   .trim()
  //   .match(/^\d+/)[0];

  const totalResults = '0';

  const nextPageUrl = $('.pagination li.pagination__item--next a').attr('href');

  const results = $('ul.search-list li.search-list__item--listing');
  const data: PropertyData[] = [];
  const promises: Promise<any>[] = [];

  results.each((idx, result) => {
    const url = $(result).find('h2 a').attr('href');
    const { groups } = url.match(/\/(?<id>PR[0-9]+)\//);
    const propertyId = groups.id;

    const images: string[] = [];

    const surface = Number(
      strip($(result).find('li.surface').text().replace(/\D/g, '')),
    );

    const info: PropertyData = {
      propertyId,
      title: undefined,
      type: undefined,
      postcode: undefined,
      municipality: undefined,
      neighborhood: undefined,
      agent: undefined,
      price: undefined,
      surface,
      images,
      url,
      coords: [],
      dateAvailable: undefined,
    };

    data.push(info);
    promises.push(processListing(info));
  });

  return Promise.all(promises).then((data) => {
    return { data, nextPage: nextPageUrl };
  });
}
