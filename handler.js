"use strict";

const $ = require("cheerio");
const axios = require("axios");


module.exports.hello = async (event) => {
  return axios
    .get("https://www.nytimes.com/section/technology")
    .then((response) => {
      const body = $.load(response.data).html();
      const listItems = $('ol:nth-child(2)', body);
      const newsArticle = []; 
      $(listItems).children('li').each((i, e) => {
        const article = $(e);
        const p = $('div>p', article);
        const anchorTag = $('div>h2', article);

        const link = $('a', anchorTag);
        const title = $(link).text();
        const url = $(link).attr('href');
        const desc = $(p).text();
        
        const thisArticle = { title, desc, url };
        newsArticle.push(thisArticle);
    
      });

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(newsArticle)
      }
    });
};