import * as cheerio from 'cheerio';
import axios from 'axios';
import { PropertyData } from './types';

function strip(text: string): string {
  return text
    .replace('\n', '')
    .replace(/\n\s+/g, ' ')
    .trim();
}

async function run() {
  let shouldRun = true;
  let pageUrl =
    'https://www.pararius.nl/huurwoningen/amsterdam/0-1600/50m2/2-slaapkamers';
  while (shouldRun) {
    try {
      const { data, nextPage } = await crawl(pageUrl);
      pageUrl = nextPage;
      shouldRun = !!nextPage;
      console.log(data, pageUrl);
    } catch (e) {
      console.error('RUN ERROR', e);
    }
  }
}

interface CrawlData {
  data: PropertyData[];
  nextPage: string;
}

async function crawl(url: string): Promise<CrawlData> {
  const axiosInstance = axios.create({ baseURL: 'https://www.pararius.nl' });
  const page = await axiosInstance.get(url, {});
  const $ = cheerio.load(page.data);
  const totalResults = $('.search-results-container .count')
    .text()
    .trim()
    .match(/^\d+/)[0];

  const nextPageUrl = $('.pagination li.next a').attr('href');

  const results = $('.search-results-list li.property-list-item-container');
  const data: PropertyData[] = [];

  results.each((idx, result) => {
    const propertyId = $(result).data('property-id');
    const images = [];
    $(result)
      .find('.single-photo-slider img')
      .each((i, e) => {
        const imageSrc = $(e).attr('src') || $(e).data('src');
        images.push(imageSrc);
      });

    const type = $(result)
      .find('h2 a span')
      .text();
    const title = strip(
      $(
        $(result)
          .find('h2 a')
          .contents()[2],
      ).text(),
    );

    const breadcrumbs = $(result).find('ul.breadcrumbs li');

    const postcode = strip($(breadcrumbs.contents()[0]).text());
    const municipality = strip($(breadcrumbs.contents()[1]).text());
    const neighborhood = strip($(breadcrumbs.contents()[2]).text());

    const agent = strip(
      $(result)
        .find('p.estate-agent a')
        .text(),
    );

    const price = Number(
      strip(
        $(result)
          .find('p.price')
          .text()
          .replace(/\D/g, ''),
      ),
    );

    const surface = Number(
      strip(
        $(result)
          .find('li.surface')
          .text()
          .replace(/\D/g, ''),
      ),
    );

    const info: PropertyData = {
      propertyId,
      type,
      title,
      postcode,
      municipality,
      neighborhood,
      agent,
      price,
      surface,
      images,
    };

    data.push(info);
  });

  return { data, nextPage: nextPageUrl };
}

export default run;
