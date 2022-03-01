const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.category-products .container--md')
    .map((i, element) => {
      
      const name = $(element)
        .find('.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      var image = $(element)
      .find('.product-image')
      .children()
      .attr('src');

      if(image !== undefined){
        image = image.toString()
                     .replace(' ', '%20');
      }

      const link = $(element)
      .parent()
      .attr('href');

      const brand = '1083';
      const favorite = false;

      return {name, price, image, link, brand, favorite};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
