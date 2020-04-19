"use strict";
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
const apiUrl = process.env.API_URL || 'http://localhost:4000/properties';
const scraperUrl = process.env.SCRAPER_URL || 'http://localhost:4001';
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
    console.log('Attempting to create entry\nSource: ', data.source, 'Identifier: ', data.sourceIdentifier);
    return axios_1.default.post(`${apiUrl}/`, data);
}
function saveResults(results) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(results) || results.length < 1)
            return;
        const errors = [];
        const notUnique = [];
        // now do a request to save each result
        const process = results.reduce((p, result) => {
            return p
                .then(_ => requestCreate(result))
                .catch(e => {
                var _a, _b;
                if (((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === 'not_unique')
                    notUnique.push(result);
                console.log('Error saving entry', result);
                errors.push(e);
            });
        }, Promise.resolve());
        return process.then(() => {
            console.log('Processing complete!');
            return { errors, notUnique };
        });
    });
}
function fetchResults(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${scraperUrl}/run`, {
            params: {
                search_url: url,
            },
        });
        return response === null || response === void 0 ? void 0 : response.data;
    });
}
function run(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                console.log('No search URL specified');
                return reject('No search URL specified');
            }
            try {
                let notUniqueCount = 0;
                let page = url;
                while (notUniqueCount < 3) {
                    const data = yield fetchResults(page);
                    const results = (data === null || data === void 0 ? void 0 : data.data) || [];
                    page = data.nextPage;
                    const { errors, notUnique } = yield saveResults(results);
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
            }
            catch (e) {
                console.log(e);
            }
        }));
    });
}
// for AWS Lambda
exports.handler = function (event, context) {
    return __awaiter(this, void 0, void 0, function* () {
        // uses a cloudwatch event with a simple json payload
        console.log('event', event);
        const { url } = event;
        yield run(url);
    });
};
// for development
const searchURL = process.env.SEARCH_URL;
if (process.env.NODE_ENV === 'development' && !!searchURL) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield run(searchURL);
    }))();
}
//# sourceMappingURL=index.js.map