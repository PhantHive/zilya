"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenorApiSearcher = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const tenorApiSearcher = (query) => new Promise(async (resolve, reject) => {
    let searcher = "https://g.tenor.com/v2/search?q='" + query + "'&key=" +
        process.env.TENOR_API + "&limit=" + 20;
    try {
        let response = await (0, node_fetch_1.default)(searcher);
        // parse the json response into a javascript object
        let json = await response.json();
        let index = Math.floor(Math.random() * json.results.length);
        let gif = json.results[index].media_formats["gif"].url;
        resolve(gif);
    }
    catch {
        reject("Error while fetching data from Tenor API");
    }
});
exports.tenorApiSearcher = tenorApiSearcher;
