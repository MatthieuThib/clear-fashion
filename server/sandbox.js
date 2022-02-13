/* eslint-disable no-console, no-process-exit */
const fs = require('fs');

const dedicatedbrand = require('./sources/dedicatedbrand');
const adressbrand = require('./sources/adressbrand');
const montlimartbrand = require('./sources/montlimartbrand');

const urlAdresse1 =  'https://adresse.paris/630-toute-la-collection';
const urlAdresse2 =  'https://adresse.paris/630-toute-la-collection?p=2';
const urlDedicated = 'https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fnews';
const urlMontlimart = 'https://www.montlimart.com/toute-la-collection.html';


function saveAsJson (products){
  var json = JSON.stringify(products, null, 2);
  console.log('💾  Saving products as products.json');
  fs.writeFileSync('products/products.json', json);
}

async function sandbox (eshop = 'all') {
  try {
    console.log(`🕵️‍♀️  Browsing ${eshop} source(s)`);

    var products = []

    if(eshop === 'all'){
      products = products.concat(await dedicatedbrand.scrape(urlDedicated));
      products = products.concat(await adressbrand.scrape(urlAdresse1));
      products = products.concat(await adressbrand.scrape(urlAdresse2));
      products = products.concat(await montlimartbrand.scrape(urlMontlimart));
    }

    else if(eshop.includes('dedicated')){
      products = await dedicatedbrand.scrape(urlDedicated);
    }

    else if(eshop.includes('adress')){
      const product1 = await adressbrand.scrape(urlAdresse1);
      const product2 = await adressbrand.scrape(urlAdresse2);
      products = product1.concat(product2);

    }
    
    else if(eshop.includes('montlimart')){
      products = await montlimartbrand.scrape(urlMontlimart);
    }

    saveAsJson(products);

    //console.log('🔍  Scrapped Products:')
    //console.log(products);
    console.log('✅  Done');

    process.exit(0);
  } 
  
  catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
