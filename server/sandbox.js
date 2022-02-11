/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const adressbrand = require('./sources/adressbrand');
const montlimartbrand = require('./sources/montlimartbrand');

// https://adresse.paris/630-toute-la-collection

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    var products = []

    if(eshop.includes('dedicated')){
      products = await dedicatedbrand.scrape(eshop);
    }
    else if(eshop.includes('adress')){
      products = await adressbrand.scrape(eshop);
    }
    else if(eshop.includes('montlimart')){
      products = await montlimartbrand.scrape(eshop);
    }

    console.log(products);
    console.log('done');
    process.exit(0);
  } 
  
  catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
