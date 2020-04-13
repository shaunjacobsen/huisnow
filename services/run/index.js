"use strict";
// on invoke...
// call scraper api
// save each result
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const apiUrl = 'http://localhost:4000/properties';
const scraperUrl = 'http://localhost:4001';
function requestCreate(property) {
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
    return axios_1.default.post(`${apiUrl}/`, data);
}
function saveResults(results) {
    if (results && results.data && results.data.data) {
        if (!Array.isArray(results.data.data))
            return;
        // now do a request to save each result
        results.data.data.reduce((p, result) => {
            return p
                .then((_) => requestCreate(result))
                .catch((e) => console.log('err', e));
        }, Promise.resolve());
    }
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield axios_1.default.get(`${scraperUrl}/run`, {
            params: {
                search_url: 'https://www.pararius.nl/huurwoningen/amsterdam/0-1600/50m2/2-slaapkamers',
            },
        });
        saveResults(results);
    }
    catch (e) {
        console.log(e);
    }
}))();
//# sourceMappingURL=index.js.map