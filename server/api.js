const cors = require('cors');
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

  response.send({"count" : products.length, "products" : products});
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

