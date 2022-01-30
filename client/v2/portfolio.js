// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let favProducts = [];

// elements by default
var brand = "All";
var filterReasonablePrice = "Off";
var filterRecentProducts = "Off";
var sort = 'No';

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectRecentProducts = document.querySelector('#recentProducts-select');
const selectReasonablePrice = document.querySelector('#reasonablePrice-select');
const selectFav = document.querySelector('#fav-select');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');

// Indicators
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');
const spanLastDate = document.querySelector('#lastDate');

const checkboxFav = document.querySelector('#toggle-heart');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );

    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand.toUpperCase()}</span>
        <a href="${product.link}"target="_blank">${product.name}</a>
        <span>${product.price}</span>

        <label class = "ck-label">
          <input type="checkbox"  id="toggle-heart-${product.name}" onclick="checkFav('${product.uuid}')" />
          <label for="toggle-heart-${product.name}">❤</label> 
        </label>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  //spanNbProducts.innerHTML = count;
  spanNbProducts.innerHTML = currentProducts.length;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};




/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */

// SELECT PAGE SIZE
selectShow.addEventListener('change', event => {
  currentPagination.pageSize = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});

// SELECT PAGE NUMBER
selectPage.addEventListener('change', event => {
  currentPagination.currentPage = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});

// SELECT BRAND FILTER
selectBrand.addEventListener('change', event => {
  var brand = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});
 
// SELECT RECENTLY RELEASED PRODUCTS 
selectRecentProducts.addEventListener('change', event => {
  var filterRecentProducts = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});

// SELECT REASONABLE PRICE FILTER
selectReasonablePrice.addEventListener('change', event => {
  var filterReasonablePrice = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});

// SELECT FAV FILTER
selectFav.addEventListener('change', event => {
  var fav = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});

// SELECT SORT FILTER
selectSort.addEventListener('change', event => {
  var sort = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterRecentProducts === 'On') { currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
             else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }})
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
    .then(() => addBrandsInSelectBox(getDisplayedBrands())) 
    .then(() => addRecentlyReleasedFilterInSelectBox())
    .then(() => addResonablePriceFilterInSelectBox())
    .then(() => addFavFilterInSelectBox())
);


// Feature 1 - Browse pages

// Feature 2 - Filter by brands

// get brands currently displayed
// return list of that brands
const getDisplayedBrands = () => {
  return [...new Set(currentProducts.map (obj => obj.brand))]; };

// add brands currently displayed as option in By brands selectbox
const addBrandsInSelectBox = (brands) => {
  var selectBox = document.getElementById('brand-select');
  selectBox.options.length = 0;
  selectBox.options.add(new Option("All", "All", false));

  brands.forEach(brand => {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(brand));
    opt.value = brand; 
    selectBox.appendChild(opt)
  });

}

//Feature 3 - Filter by recent products
const addRecentlyReleasedFilterInSelectBox = () => {
  var selectBox = document.getElementById('reasonablePrice-select');
  selectBox.options.length = 0;
  selectBox.options.add(new Option("Off", "Off", true));
  selectBox.options.add(new Option("On", "On", false));
}

//Feature 4 - Filter by reasonable price
const addResonablePriceFilterInSelectBox = () => {
  var selectBox = document.getElementById('recentProducts-select');
  selectBox.options.length = 0;
  selectBox.options.add(new Option("Off", "Off", true));
  selectBox.options.add(new Option("On", "On", false));
}

//Feature 5 - Sort by price
//Feature 6 - Sort by date

//Feature 8 - Number of products indicator
const updateNbProducts = () => {
  spanNbProducts.innerHTML = currentProducts.length;
}

//Feature 9 - Number of recent products indicator
function isRecent(p){
  return (new Date().getTime() - new Date(p.released).getTime())/(24*60*60*1000) < 14;
}
const updateNbNewProducts = () => {
  spanNbNewProducts.innerHTML = currentProducts.filter(isRecent).length;
}

// Feature 10 - p50, p90 and p95 price value indicator
function pValue(products, p){
  let index = parseInt(products.length * p/100);
  console.log(p, products.sort(sortByPrice)[index]);
  var pvalue = products.sort(sortByPrice)[index].price;
  return pvalue;
}
function sortByPrice(a, b){
  return a.price - b.price;
}

const updatePValues = () => {
  console.log(pValue(currentProducts, 50));
  spanp50.innerHTML = pValue(currentProducts, 50);
  spanp90.innerHTML = pValue(currentProducts, 90);
  spanp95.innerHTML = pValue(currentProducts, 95);
}

// Feature 11 - Last released date indicator
function sortByDate(a, b){
  return new Date(a.date).getDate() - new Date(b.date).getDate();
}
function lastProductReleasedDate(products){
  return products.sort(sortByDate)[0].released
}
const updateLastReleasedProductDate = () => {
  spanLastDate.innerHTML = lastProductReleasedDate(currentProducts);
}

const updateIndicators = () => {
  updateNbProducts();
  updateNbNewProducts();
  updatePValues();
  updateLastReleasedProductDate();
}

// Feature 12 - Open product link
// add target="_blank" in render products href link

// Feature 13 - Save as favorite

// Feature 14 - Filter by favorite
const addFavFilterInSelectBox = () => {
  var selectBox = document.getElementById('fav-select');
  selectBox.options.length = 0;
  selectBox.options.add(new Option("Off", "Off", true));
  selectBox.options.add(new Option("On", "On", false));
}

function checkFav(uuid){
  currentProducts.forEach(product => {
    if(product.uuid === uuid && !favProducts.includes(product)){
      var p = product;
      p.fav = true;
      favProducts.push(p);
    }
  })
}

function isFavorite(uuid, favProducts){
  let boolean = false;
  favProducts.forEach(product => {
    if(product.uuid === uuid){
      return true;
    }
  })
}
// Feature 15 - Usable and pleasant UX
//style.css











