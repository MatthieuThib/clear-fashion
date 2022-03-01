const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.item-content')
    .map((i, element) => {
      
      const name = $(element)
        .find('.gf_product-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.gf_product-price')
          .text()
      );
      

      var image = 'https:' + $(element)
      .find('.gf_product-image')
      .attr('src');

      if(image !== undefined){
        image = image.toString()
                     .replace(' ', '%20');
      }

      const link = 'https://ecclo.fr' + $(element)
      .find('.gf_product-title')
      .attr('href');

      const brand = 'ECCLO';
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
