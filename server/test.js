const fetch = require("node-fetch");

var products = []

const url = `https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fnews`;



(async function() {
    const response = await fetch(url);

    if (response.ok) {
        const body = await response.json();

        let i = 0
        body.products.forEach(element => {
            // if the length of the element is not defined, then it means that 
            // the element is a json object and NOT an empty array.

            if(element.length === undefined){ 
                products.push(
                    {
                        name : element.name, 
                        price : element.price.priceAsNumber, 
                        image : element.image[0], 
                        link : `https://www.dedicatedbrand.com/en/` + element.canonicalUri
                    })
                
                //console.log(element.items);

            }
        });
        //element.name
        //element.price.priceAsNumber
        //https://www.dedicatedbrand.com/en/ + element.canonicalUri = lien complet ?
        //element.image
        //console.log(body.products[3].items);

    }
    
    console.log("Products:\n", products);

})();





