/* eslint-disable no-console, no-process-exit */
const fs = require('fs');

const dedicatedbrand = require('./sources/dedicatedbrand');
const adressbrand = require('./sources/adressbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const _1083brand = require('./sources/1083brand');
const loombrand = require('./sources/loombrand');
const ecclobrand = require('./sources/ecclobrand');
const gentlefactorybrand = require('./sources/gentlefactorybrand');

const urlAdresse =  'https://adresse.paris/630-toute-la-collection'; // + "?p=2";
const urlDedicated = 'https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fnews';
const urlMontlimart = 'https://www.montlimart.com/toute-la-collection.html'; // + "?p=2";
const url1083 = 'https://www.1083.fr/'; //homme.html?limit=108'; //+ "&p=2";
const urlLoom = 'https://www.loom.fr/collections/vestiaire-'; //+ "homme";
const urlecclo = 'https://ecclo.fr/collections/'; // + 'homme';
const urlgentlefactory = 'https://www.lagentlefactory.com/'; // + 16-homme-made-in-france'; 

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

async function browse1083 (url1083, numberOfPages = 2){
  var products = [];
  const categories = ['homme', 'femme']

  for(let c = 0; c < categories.length; c++){
    for(let i = 1; i <= numberOfPages; i++){
      var p = await _1083brand.scrape(url1083 + `${categories[c]}.html?limit=108` + `&p=${i}`);
      products = products.concat(p);
    }
  }

  return products;
}

async function browseLoom (urlLoom){
  var products = [];
  const categories = ['homme', 'femme']

  for(let c = 0; c < categories.length; c++){
    var p = await loombrand.scrape(urlLoom + `${categories[c]}`);
    products = products.concat(p);
  }

  return products;
}

async function browseEcclo (urlecclo){
  var products = [];
  const categories = ['homme', 'femme']

  for(let c = 0; c < categories.length; c++){
      var p = await ecclobrand.scrape(urlecclo + `${categories[c]}`);
      products = products.concat(p);
  }

  return products;
}

async function browseGentleFactory (urlgentlefactory, numberOfPages = 5){
  var products = [];
  const categories = ['16-homme-made-in-france', '30-femme-made-in-france']

  for(let c = 0; c < categories.length; c++){
    for(let i = 1; i <= numberOfPages; i++){
      var p = await gentlefactorybrand.scrape(urlgentlefactory + `${categories[c]}#/page-${i}`);
      products = products.concat(p);
    }
    numberOfPages = 3;
  }

  return products;
}

async function browseAll (){
  var products = [];
  
  products = products.concat(await browseDedicated(urlDedicated)); // 1572 products
  products = products.concat(await browseAdresse(urlAdresse)); // 90 products
  products = products.concat(await browseMontlimart(urlMontlimart)); // 112 products
  products = products.concat(await browse1083(url1083)); // 322 products
  products = products.concat(await browseLoom(urlLoom)); // 47 products
  products = products.concat(await browseEcclo(urlecclo)); // 64 products
  products = products.concat(await browseGentleFactory(urlgentlefactory)); // 237 products

  return products;
}



async function sandbox (eshop = 'all'){
  try {
    console.log(`🕵️‍♀️  Browsing ${eshop} source(s)`);

    var products = []

    if(eshop === 'all'){
      products = await browseAll();
      console.log(products[0]);
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

    else if(eshop.includes('1083')){
      products = await browse1083(url1083)
    }

    else if(eshop.includes('loom')){
      products = await browseLoom(urlLoom)
    }

    else if(eshop.includes('ecclo')){
      products = await browseEcclo(urlecclo)
    }

    else if(eshop.includes('gentlefactory')){
      products = await browseGentleFactory(urlgentlefactory)
    }

    products = products.filter(product => product.name !== undefined && product.name !== null
                                       && product.price !== undefined && product.price !== null
                                       && product.image !== undefined && product.image !== null
                                       && product.link !== undefined && product.link !== null
                                       && product.brand !== undefined && product.brand !== null);
    

    console.log('🔍  Scrapped Products:')
    console.log(products);
    console.log(products.length)

    saveAsJson(products);
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
