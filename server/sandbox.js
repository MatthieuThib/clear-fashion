/* eslint-disable no-console, no-process-exit */
const fs = require('fs');

const dedicatedbrand = require('./sources/dedicatedbrand');
const adressbrand = require('./sources/adressbrand');
const montlimartbrand = require('./sources/montlimartbrand');

const urlAdresse =  'https://adresse.paris/630-toute-la-collection'; // + "?p=2";
const urlDedicated = 'https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fnews';
const urlMontlimart = 'https://www.montlimart.com/toute-la-collection.html'; // + "?p=2";


function saveAsJson (products){
  var json = JSON.stringify(products, null, 2);
  console.log('💾  Saving products as products.json');
  fs.writeFileSync('products/products.json', json);
}

async function browseMontlimart (urlMontlimart, numberOfPages = 8){
  var products = [];

  for(let i = 2; i <= numberOfPages; i++){
    var p = await montlimartbrand.scrape(urlMontlimart + `?p=i`);
    products = products.concat(p);
  }

  return products;
}

async function browseAdresse (urlAdresse, numberOfPages = 2){
  var products = [];

  for(let i = 2; i <= numberOfPages; i++){
    products = products.concat(await adressbrand.scrape(urlAdresse + `?p=i`));
  }

  return products;
}

async function browseDedicated (urlMontlimart){
  var products = [];
  products = products.concat(await dedicatedbrand.scrape(urlDedicated));

  return products;
}

async function browseAll (){
  var products = [];
  products = products.concat(await browseDedicated(urlDedicated)); // 1572 products
  products = products.concat(await browseAdresse(urlAdresse)); // 90 products
  products = products.concat(await browseMontlimart(urlMontlimart)); // 112 products

  return products;
}



async function sandbox (eshop = 'all'){
  try {
    console.log(`🕵️‍♀️  Browsing ${eshop} source(s)`);

    var products = []

    if(eshop === 'all'){
      products = await browseAll();
    }

    else if(eshop.includes('dedicated')){
      products = await browseDedicated(urlDedicated);
    }

    else if(eshop.includes('adresse')){
      products = await browseAdresse(urlAdresse);
    }
    
    else if(eshop.includes('montlimart')){
      products = await browseMontlimart(urlMontlimart)
    }

    saveAsJson(products);

    // console.log('🔍  Scrapped Products:')
    // console.log(products);
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
