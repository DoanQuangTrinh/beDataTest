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
    const status = []
    $('[title]').each((index, element) => {
      const title = $(element).attr('title');
      status.push(title);
    });
    const content = $('.list-lander-p');
    let contentElement;
    if (content.length > 0) {
      contentElement = content.text();
    }else {
      contentElement = $('.IntroQuote-module_introQuote__oeqmW').text();
    }


    const info = [];
    $('h1').each((index , element) => {
      const infoTitle = $(element).text();
      info.push(infoTitle);
    })

    // const divIf = [];
    // $('div').each((index , element) => {
    //   const divinfomation = $(element).text();
    //   divIf.push(divinfomation);
    // })

    const infoObject = [];
    $('li').each((index , element) => {
      const infoObjectDoc = $(element).text();
      infoObject.push(infoObjectDoc);
    })
    
    const externalLinks = $('a').map(function() {
      return $(this).attr('href');
    }).get();


    const imageexternalLinks = $('img').map(function() {
      return $(this).attr('src');
    }).get();



    const responseData = {}

    // if (divIf) {
    //   responseData.divIf = divIf;
    // }

    if (imageexternalLinks) {
      responseData.imageexternalLinks = imageexternalLinks;
    }

    if (conpany) {
      responseData.conpany = conpany;
    }
    if (rank) {
      responseData.rank = rank;
    }
    if (title) {
      responseData.title = title;
    }
    if (status) {
      responseData.status = status;
    }
    if (contentElement) {
      responseData.contentElement = contentElement;
    }
    if (info) {
      responseData.info = info;
    }
    if (infoObject) {
      responseData.infoObject = infoObject;
    }
    if (externalLinks) {
      responseData.externalLinks = externalLinks;
    }
   
    

    if(Object.keys(responseData).length > 0) {
      res.send({responseData });
    } else {
      res.send("không có dữ liệu hiển thị");
    }

    // res.send({rank})
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Error scraping data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
