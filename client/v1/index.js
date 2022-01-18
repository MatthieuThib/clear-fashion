// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];

console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);

/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
console.log('\nTODO: The cheapest t-shirt');

// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
const cheapestTshirt = 'https://adresse.paris/t-shirts-et-polos/3983-t-shirt-ranelagh-1300000259194.html'
// 2. Log the variable
console.log(cheapestTshirt);

/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
console.log('\nTODO: Number of products');
// 1. Create a variable and assign it the number of products
var n = marketplace.length;
// 2. Log the variable
console.log(n)

// 🎯 TODO: Brands name
console.log('\nTODO: Brands name');
// 1. Create a variable and assign it the list of brands name only
var allBrands = []
for (let i = 0; i < marketplace.length; i++){
  allBrands.push(marketplace[i].brand);
}
var brandNames = Array.from(new Set(allBrands));
// 2. Log the variable
console.log(brandNames);
// 3. Log how many brands we have
console.log(brandNames.length)

// 🎯 TODO: Sort by price
console.log('\nTODO: Sort by price');
// 1. Create a function to sort the marketplace products by price
function sortByPrice(a, b){
  return a.price - b.price;
}
// 2. Create a variable and assign it the list of products by price from lowest to highest
var sortedByPrice_marketplace = marketplace.sort(sortByPrice);
// 3. Log the variable 
console.log(sortedByPrice_marketplace);

// 🎯 TODO: Sort by date
console.log('\nTODO: Sort by date');

// 1. Create a function to sort the marketplace objects by products date
function sortByDate(a, b){
  return new Date(a.date).getDate() - new Date(b.date).getDate();
}
// 2. Create a variable and assign it the list of products by date from recent to old
var sortedByDate_marketplace = marketplace.sort(sortByDate);
// 3. Log the variable
console.log(sortedByDate_marketplace)

// 🎯 TODO: Filter a specific price range
console.log('\nTODO: Filter a specific price range');
// 1. Filter the list of products between 50€ and 100€
function filterPrices(a){
  return a.price > 50 && a.price < 100;
}
var filteredByPrice_marketplace = marketplace.filter(filterPrices);
// 2. Log the list
console.log(filteredByPrice_marketplace)

// 🎯 TODO: Average Basket
console.log('\nTODO: Average Basket');
// 1. Determine the average basket of the marketplace
var avgBasket = 0;
for (let i = 0; i < marketplace.length; i++){
  avgBasket += marketplace[i].price;
}
avgBasket = avgBasket / n;
// 2. Log the average
console.log(avgBasket);

/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */


// 🎯 TODO: Products by brands
console.log('\nTODO: Products by brands');
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };

const brands = {}; 

brandNames.forEach(function (brandName) {
  brands[brandName] = []
  for (let i = 0; i < marketplace.length; i++){ 
    if (marketplace[i].brand === brandName){
      brands[brandName].push({'link' : marketplace[i].link,
                          'price' : marketplace[i].price,
                          'name' : marketplace[i].name,
                          'date' : marketplace[i].date});
    }
  }
});
// 2. Log the variable
console.log(brands);
console.log(Array.from(brands));
// 3. Log the number of products by brands
for (var brand in brands){
  console.log(brand, brands[brand].length);
}

// 🎯 TODO: Sort by price for each brand
console.log('\nTODO: Sort by price for each brand');
// 1. For each brand, sort the products by price, from highest to lowest
var sortedByPrice_brands = {};
for (var brand in brands){
  sortedByPrice_brands[brand] = [];
  sortedByPrice_brands[brand].push(brands[brand].sort(sortByPrice));
}
// 2. Log the sort
console.log(sortedByPrice_brands);


// 🎯 TODO: Sort by date for each brand
console.log('\nTODO: Sort by date for each brand');
// 1. For each brand, sort the products by date, from old to recent
var sortedByDate_brands = {};
for (var brand in brands){
  sortedByDate_brands[brand] = [];
  sortedByDate_brands[brand].push(brands[brand].sort(sortByDate));
}
// 2. Log the sort
console.log(sortedByDate_brands);

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
console.log('\nTODO: Compute the p90 price value');
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products
var p90_brands = {};
for (var brand in brands){
  let index = parseInt(brands[brand].length * 10/100);
  p90_brands[brand] = brands[brand].sort(sortByPrice)[index].price;
}
console.log(p90_brands);

/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
console.log('\nTODO: New released products');
// 1. Log if we have new products only (true or false)
// A new product is a product `released` less than 2 weeks.
function haveNewProducts(productsArray){
  let newProducts = 0;
  for (let i=0; i <productsArray.length; i++){
    if ((new Date().getTime() - new Date(productsArray[i].released).getTime())/(24*60*60*1000) < 14){
      newProducts++;
    }
  }
  return newProducts > 0;
}
console.log('New products ? ', haveNewProducts(COTELE_PARIS));



// 🎯 TODO: Reasonable price
console.log('\nTODO: Reasonable price');
// 1. Log if coteleparis is a reasonable price shop (true or false)
// A reasonable price if all the products are less than 100€
function reasonableShop(productsArray){
  let unreasonable = 0;
  for (let i=0; i < productsArray.length; i++){
    if(productsArray[i].price > 100){
      unreasonable++;
    }
  }
  return unreasonable == 0;
}
console.log(reasonableShop(COTELE_PARIS));


// 🎯 TODO: Find a specific product
console.log('\nTODO: Find a specific product');
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
function findProduct(uuid, productsArray){
  let product = {};
  for (let i=0; i < productsArray.length; i++){
    if(productsArray[i].uuid === uuid){
      product = productsArray[i];
      break;
    }
  }
  return product;
}
// 2. Log the product
console.log(findProduct(`b56c6d88-749a-5b4c-b571-e5b5c6483131`,COTELE_PARIS));


// 🎯 TODO: Delete a specific product
console.log('\nTODO: Delete a specific product');
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
function deleteProduct(uuid, productsArray){
  let products = productsArray
  for (let i=0; i < products.length; i++){
    if(products[i].uuid === uuid){
      products.splice(i,1);
      break;
    }
  }
  return products;
}
// 2. Log the new list of product
console.log(deleteProduct(`b56c6d88-749a-5b4c-b571-e5b5c6483131`, COTELE_PARIS))

// 🎯 TODO: Save the favorite product
console.log('\nTODO: Save the favorite product');

let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
let jacket = blueJacket;
// and set a new property `favorite` to true
jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
console.log('Blue jacket: ', blueJacket)
console.log('Jacket: ', jacket)
// 2. What do you notice?
// Both have a favorite attribute 

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};


console.log('Without mutating original object:')
// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties
jacket = {...blueJacket, 'favorite' : true}

console.log('Blue jacket: ', blueJacket)
console.log('Jacket: ', jacket)

/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
console.log('\nTODO: Save in localStorage');
// 1. Save MY_FAVORITE_BRANDS in the localStorage
localStorage.setItem('MY_FAVORITE_BRANDS', MY_FAVORITE_BRANDS);
// 2. log the localStorage
console.log(MY_FAVORITE_BRANDS);
