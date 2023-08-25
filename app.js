const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 5000;

app.use(cors());

app.get('/scrape', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const conpany = $('.company').text();
    const rank = $('.rank').text();
    const title = $('.title-news').text();
    const itemsWithTitles = []
    $('[title]').each((index, element) => {
      const title = $(element).attr('title');
      itemsWithTitles.push(title);
    });
    //  rank: $('.rank').text(),
    //  year: $('.year').text(),


    res.send({conpany , rank ,title  , itemsWithTitles});
    // res.send({rank})
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Error scraping data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
