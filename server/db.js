const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://cf:ClearFashion2022@clearfashion.icpqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const MONGODB_DB_NAME = "clearfashion"

var client = null;
var db = null;
var connected = false;

var products = require('./products/products.json');

async function OpenConnection(MONGODB_URI, MONGODB_DB_NAME){
    try {
        client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
        db = client.db(MONGODB_DB_NAME);
        console.log(` ✅ Connected To MongoDB`);
        connected = true;
    } 
    catch(e) {
        console.error(e);
    }
}

async function CloseConnection(client){
    await client.close();
    connected = false;
    
    console.log(" ❌ Connection Closed");
}

async function InsertProducts(products){

    if(await db.listCollections({ name: db.collection.name }).toArray().length != 0){
        // drop databse if exists
        db.dropCollection("products");
    }
    
    db.createCollection("products");

    console.log(` 🐣 Inserting ${products.length} products`);
    const collection = await db.collection('products');
    await collection.insertMany(products);
}

async function main(){
    await OpenConnection(MONGODB_URI, MONGODB_DB_NAME);
    
    await InsertProducts(products);
    
    await CloseConnection(client);
}

main();