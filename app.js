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
    const selector = req.query.selector;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    console.log(selector);

    const data = [];
    $(selector).each((index, element) => {
      const text = $(element).text();
      data.push(text);
    });

    if (data.length > 0) {
      res.send({ data });
    } else {
      res.send("Không có dữ liệu hiển thị");
    }
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Error scraping data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
