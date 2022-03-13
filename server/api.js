const cors = require('cors');
const { application, query } = require('express');
const express = require('express');
const helmet = require('helmet');
const db = require ('./db')
const ObjectId = require('mongodb').ObjectId;

const PORT = 8092;
const app = express();
module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());

var products = "";

app.get('/products', async(request, response) => {
  products = await db.FindProducts()

  response.send({"total" : products.length, "results" : products});
});

app.use('/products/search', async(request, response, next) => {
  const filters = request.query;
  var brand = "";
  var defaultPrice = 0;
  var defaultLimit = 12;

  var query = []
  var match = {}

  if(filters.limit > 0){
    defaultLimit = parseInt(filters.limit)
    //query.push({ $limit : defaultLimit })
  }
  if(filters.price > 0){
    defaultPrice = parseInt(filters.price)
    match.price = { "$lte" : defaultPrice }
  }
  if(filters.brand !== undefined){
    brand = filters.brand.toUpperCase()
    match.brand = brand 
  }
  
  //console.log('filters: ', filters)
  
  query.push({ $match : match})
  query.push({ $sort : { price : 1} })
  query.push({ $limit : defaultLimit })

  //console.log('query :', query)
  
  products = await db.AggregatesProducts(query)
  
  response.send({"limit" : defaultLimit, "total" : products.length, "results" : products});
});

app.get('/products/:id', async(request, response) => {
  products = await db.FindProducts(
    {'_id': new ObjectId(request.params.id)},
    false);
  response.send({"count" : products.length, "products" : products});
})

async function main(){
  await db.OpenConnection();

  app.listen(PORT, (err) => {
    if (err) console.error('❌ Unable to connect the server: ', err);
    console.log(` 📡 Running on port ${PORT}`);
  });
  
}

main()

