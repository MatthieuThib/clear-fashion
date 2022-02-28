const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  console.log(data);

  return $('.main__products').find('#products-container')
    .map((i, element) => {
      console.log(`\n\n\n\n\n\n` + $(element).prop())
      //console.log(i, '\n\n\nElement:\n', $(element));
      
      /*const name = $(element)
          .find('.group relative flex-shrink-0');
      console.log(name);*/
      
      const price = parseInt(
        $(element)
          .find('.text-xs')
          .text());
          /*
      var image = 'https:' + $(element)
      .find('noscript img.product_card__image')
      .attr('src');

      if(image !== undefined){
        image = image.toString()
                     .replace(' ', '%20');
      }*/

      //const link = 'https://www.wedressfair.fr/' + $(element).children()
      const link = 'https://www.wedressfair.fr/' /*+ $(element).children()
      .attr('href');*/

      const brand = 'WEDRESSFAIR';



      return {price} //, image, link, brand};
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
