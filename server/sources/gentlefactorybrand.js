const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('#center_column .product_list__wrapper')
    .map((i, element) => {
      
      const name = $(element)
        .find('.product_list--title')
        .children()
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );

      var image = $(element)
      .find('.img_product')
      .attr('src');

      if(image !== undefined){
        image = image.toString()
                     .replace(' ', '%20');
      }

      const link = $(element)
      .find('.product_list--title')
      .children()
      .attr('href');

      const brand = 'LA GENTLE FACTORY';
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
