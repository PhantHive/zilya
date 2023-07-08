import fetch from "node-fetch";

const tenorApiSearcher = (query: string) => new Promise(async (resolve, reject) => {

    let searcher: string = "https://g.tenor.com/v2/search?q='" + query + "'&key=" +
        process.env.TENOR_API + "&limit=" + 20;

    try {
        let response = await fetch(searcher)
        // parse the json response into a javascript object
        let json = await response.json();
        let index = Math.floor(Math.random() * json.results.length);
        let gif = json.results[index].media_formats["gif"].url;
        resolve(gif);
    }
    catch {
        reject("Error while fetching data from Tenor API");
    }

})

export {
    tenorApiSearcher
};