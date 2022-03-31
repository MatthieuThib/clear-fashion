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

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectReasonablePrice = document.querySelector('#reasonablePrice-select');
const selectFav = document.querySelector('#fav-select');
const favButton = document.querySelector('#favButton');
const selectSort = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');

// Indicators
const spanNbProducts = document.querySelector('#nbProducts');
const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');

const checkboxFav = document.querySelector('#toggle-heart');


// When the user scrolls, fix the navbar to the top of the page and the filters on the left
window.onscroll = function() {StickyNavbar(), StickyFilters()};

// Get the navbar
var navbar = document.getElementById("navbar");
var navbarLogo = document.getElementById("navbar-l");

var columnleft = document.getElementById("columnleft");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;
var sticky2 = columnleft.offsetTop;

function StickyNavbar() {
  if (window.pageYOffset >= sticky - 10) {
    navbar.classList.add("sticky")
    navbarLogo.classList.add("stickyl")
  } else {
    navbar.classList.remove("sticky");
    navbarLogo.classList.remove("stickyl");
  }
}

function StickyFilters() {
  if (window.pageYOffset >= sticky2 - 110) {
    columnleft.classList.add("stickyf")
  } else {
    columnleft.classList.remove("stickyf");
  }
}

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  console.log("result", result)
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=15] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 15) => {
  try {
  
    const response = await fetch(`https://clear-fashion-matthieu-api.vercel.app/products?page=${page}&size=${size}`);
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
      <div class="column1" id="column1">
        <img class="product-image" src=${product.image}>
        <div class="product-info">

          <a style="font-size:20px;text-align:center;" href="${product.link}"target="_blank">${product.name}</a>
            
          <div class="product-price" style="margin-bottom:100px;">
          <span style="font-size:30px;text-align:center;" >${product.brand.toUpperCase()} - </span>
            <span style="font-size:30px;text-align:left;">${product.price} €  </span>     
            <label class = "ck-label">
              <input type="checkbox"  id="toggle-heart-${product.name}" onclick="checkFav('${product._id}')" />
              <label for="toggle-heart-${product.name}">❤</label> 
            </label>
          </div>
        </div> 
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2> </h2>';
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
 */

// SELECT PAGE SIZE
selectShow.addEventListener('change', event => {
  currentPagination.pageSize = parseInt(event.target.value);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
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
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }})
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
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
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
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
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
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});






var showfav = false;
favButton.addEventListener('click', event => {
  if(showfav){
    showfav = false;
  }
  else{
    showfav = true;
  }

  console.log(showfav);
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
    .then(() => { if(showfav == true) { currentProducts = favProducts; console.log(currentProducts)} })
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
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
});







const searchbar = document.querySelector('#searchbar')
searchbar.addEventListener("input", e => {
  let value = e.target.value

  // When at least 2 chars are entered, we search for products.
  if (value && value.trim().length > 1){
    fetchProducts(1,3000)
    .then(setCurrentProducts)
    .then(() => value = value.trim().toLowerCase())
    .then(() => currentProducts = currentProducts.filter(element => element.name.toLowerCase().includes(value)))
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
  }
  
  else{
    fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => addBrandsInSelectBox(getDisplayedBrands()))
    .then(() => { if (brand !== 'All') {currentProducts = currentProducts.filter(element => element.brand === brand)} })
    
    .then(() => { if(filterReasonablePrice === 'On') { currentProducts = currentProducts.filter(element => element.price < 50)} })
    .then(() => { if (sort === 'price-desc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price < e2.price}) }
             else if (sort === 'price-asc') {currentProducts = currentProducts.sort( (e1, e2) => { return e1.price > e2.price}) }
             })
    .then(() => { if(fav === 'On') { currentProducts = favProducts} })
    .then(() => render(currentProducts, currentPagination))
    .then(() => updateIndicators());
  }
});





document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
    .then(() => addBrandsInSelectBox(getDisplayedBrands())) 
    .then(() => addResonablePriceFilterInSelectBox())
    .then(() => addFavFilterInSelectBox())
);


// Filter by brands
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

// Filter by reasonable price
const addResonablePriceFilterInSelectBox = () => {
  var selectBox = document.getElementById('reasonablePrice-select');
  selectBox.options.length = 0;
  selectBox.options.add(new Option("Off", "Off", true));
  selectBox.options.add(new Option("On", "On", false));
}

// Number of products indicator
const updateNbProducts = () => {
  spanNbProducts.innerHTML = currentProducts.length;
}

// Number of recent products indicator
function isRecent(p){
  return (new Date().getTime() - new Date(p.released).getTime())/(24*60*60*1000) < 14;
}

// p-Values (p50, p90 and p95)
function pValue(products, p){
  let index = parseInt(products.length * p/100);
  var pvalue = products.sort(sortByPrice)[index].price;
  return pvalue;
}
function sortByPrice(a, b){
  return a.price - b.price;
}

const updatePValues = () => {
  spanp50.innerHTML = pValue(currentProducts, 50);
  spanp90.innerHTML = pValue(currentProducts, 90);
  spanp95.innerHTML = pValue(currentProducts, 95);
}

const updateIndicators = () => {
  updateNbProducts();
  updatePValues();
}

// Filter by favorite
const addFavFilterInSelectBox = () => {
  var selectBox = document.getElementById('fav-select');
  selectBox.options.length = 0;
  selectBox.options.add(new Option("Off", "Off", true));
  selectBox.options.add(new Option("On", "On", false));
}

function checkFav(_id){
  currentProducts.forEach(product => {
    if(product._id === _id && !favProducts.includes(product)){
      var p = product;
      p.fav = true;
      favProducts.push(p);
    }
  })
}

function isFavorite(_id, favProducts){
  favProducts.forEach(product => {
    if(product._id === _id){
      return true;
    }
  })
}

function SwitchMode(idElementsToToggle) {
  const logo = document.querySelector('#logotopnav');
  if(logo.src.match("./ressources/Logo-gb.svg")) logo.src = "./ressources/Logo-gw.svg"
  else logo.src = "./ressources/Logo-gb.svg"

  var element = document.body;
  element.classList.toggle("dark-mode");
  
  document.querySelectorAll('#column1').forEach((element) => {
    if(element.className.slice(-5) === "-dark") element.className = element.className.slice(0,-5)
    else element.className = element.className + "-dark"
  })


  idElementsToToggle.forEach(idElement => { 
    element = document.querySelector('#'+idElement);
    if(element.className.slice(-5) === "-dark") element.className = element.className.slice(0,-5)
    else element.className = element.className + "-dark"
    console.log(element.className)
  })
}