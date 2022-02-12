const fetch = require("node-fetch");

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
 module.exports.scrape = async url => {
    try {
        const response = await fetch(url);

        if (response.ok) {
            var products = []
            const body = await response.json();
            
            body.products.forEach(element => {
                if(element.length === undefined){ 
                // if the length of the element is not defined, then it means that 
                // the element is a json object and NOT an empty array.
                    products.push(
                        {
                            name : element.name, 
                            price : element.price.priceAsNumber,
                            image : element.image[0], 
                            link : `https://www.dedicatedbrand.com/en/` + element.canonicalUri,
                            brand : 'DEDICATED'
                        })
                }
            });

            return products;
        }
  
        console.error(response); 
        return null;
    } 
    catch (error) {
        console.error(error);
        return null;
    }
  };



