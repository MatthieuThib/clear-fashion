const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data, {'xmlMode': true});

  return $('.product-grid__item')
    .map((i, element) => {
      
      const name = $(element)
          .find('.product-title')
          .text()
          .trim()
          .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.money')
          .text());

      var image = 'https:' + $(element)
      .find('noscript img.product_card__image')
      .attr('src');

      if(image !== undefined){
        image = image.toString()
                     .replace(' ', '%20');
      }

      const link = 'https://www.loom.fr' + $(element)
      .find('.product-title')
      .children()
      .attr('href');

      const brand = 'LOOM';



      return {name, image, link, brand};
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
