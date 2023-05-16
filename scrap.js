const fs = require('fs');
const superagent = require('superagent');
const cheerio = require('cheerio');
const json2csv = require('json2csv').Parser;

const express = require('express');
const app = express();

const PORT = 3000;

// Links to Scrap data from.
const imdbLinks = [
    'https://www.imdb.com/title/tt0488798/?ref_=tt_sims_tt_i_3',
    'https://www.imdb.com/title/tt0419058/?ref_=fn_al_tt_1',
    'https://www.imdb.com/title/tt0995031/?ref_=tt_sims_tt_i_2',
    'https://www.imdb.com/title/tt0805184/?ref_=tt_sims_tt_i_12',
    'https://www.imdb.com/title/tt2283748/?ref_=tt_sims_tt_i_5',
    'https://www.imdb.com/title/tt0374887/?ref_=tt_sims_tt_i_4',
    'https://www.imdb.com/title/tt8108202/?ref_=tt_sims_tt_i_9',
    'https://www.imdb.com/title/tt0845448/?ref_=tt_sims_tt_i_7',
    'https://www.imdb.com/title/tt4633694/?ref_=ext_shr_lnk'
];
// IIFE function to load html, scrap data, store information into an array and convert to csv.
(async () => {
    let imdbData = [];
    // making a request for each link and pushing data into the array.
    for (imdbLink of imdbLinks) {
        const response = await superagent.get(imdbLink);
        let $ = cheerio.load(response.text)
        let title = $('span[class="sc-afe43def-1 fDTGTb"]').text().trim();
        let releaseYear = $('div[class="sc-52d569c6-0 kNzJA-D"] > ul > li > a').text()
            .trim().slice(0, 4);
        let rating = $('span[class="sc-bde20123-1 iZlgcd"]').text().trim();
        let runtimeIndex = $('div[class="sc-52d569c6-0 kNzJA-D"] > ul:last-child').text()
            .trim().indexOf('h') - 1;
        let runtime = $('div[class="sc-52d569c6-0 kNzJA-D"] > ul:last-child').text()
            .trim().slice(runtimeIndex);

        imdbData.push({
            title,
            releaseYear,
            rating,
            runtime
        })
    }
    // Parsing Data into CSV.
    const json2csvParser = new json2csv();
    const csv = json2csvParser.parse(imdbData);
    // Writing CSV file.
    fs.writeFileSync("./Scrapped-Movies(IMDB).csv", csv, "utf-8");
}
)();