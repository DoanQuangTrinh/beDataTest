const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 5000;
app.use(express.json());

app.use(cors());

app.get('/scrape', async (req, res) => {
  try {
    const url = req.query.url;
    const type = req.query.type; // Loại chọn phần tử (class hoặc id)
    const identifier = req.query.identifier; // Tên lớp hoặc ID
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data = [];

    if (type === 'class') {
      $(`.${identifier}`).each((index, element) => {
        const text = $(element).text();
        data.push(text);
      });
    } else if (type === 'id') {
      const element = $(`#${identifier}`);
      const text = element.text();
      data.push(text);
    } else {
      res.status(400).json({ error: 'Invalid type specified' });
      return;
    }

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
