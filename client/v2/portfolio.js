// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectRecentProducts = document.querySelector('#recentProducts-select');
const selectReasonablePrice = document.querySelector('#reasonablePrice-select');

const selectSort = document.querySelector('#sort-select');

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

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
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
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

  spanNbProducts.innerHTML = count;
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
    .then(() => render(currentProducts, currentPagination));
});

// SELECT PAGE NUMBER
selectPage.addEventListener('change', event => {
  currentPagination.currentPage = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => render(currentProducts, currentPagination));
});

// SELECT BRAND FILTER
selectBrand.addEventListener('change', event => {
  var brand = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)}
    })
    .then(() => render(currentProducts, currentPagination));
});

// SELECT RECENTLY RELEASED PRODUCTS 
selectRecentProducts.addEventListener('change', event => {
  var filterRecentProducts = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => { if(filterRecentProducts === 'On') {
      currentProducts = currentProducts.filter(element => (new Date().getTime() - new Date(element.released).getTime())/(24*60*60*1000) < 14)} 
    })
    .then(() => render(currentProducts, currentPagination));
});

// SELECT REASONABLE PRICE FILTER
selectReasonablePrice.addEventListener('change', event => {
  var filterReasonablePrice = event.target.value;
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => { if(filterReasonablePrice === 'On') {
      currentProducts = currentProducts.filter(element => element.price < 50)} 
    })
    .then(() => render(currentProducts, currentPagination));
});

// SELECT SORT  FILTER
selectSort.addEventListener('change', event => {
  var sort = event.target.value;
  console.log(sort);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
                  else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
                  else if (sort === 'date-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() < new Date(e2.released).getTime()}) }
                  else if (sort === 'date-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return new Date(e1.released).getTime() > new Date(e2.released).getTime()}) }

    })
    .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
    .then(() => addBrandsInSelectBox(getDisplayedBrands())) 
    .then(() => addRecentlyReleasedFilterInSelectBox())
    .then(() => addResonablePriceFilterInSelectBox())
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


















