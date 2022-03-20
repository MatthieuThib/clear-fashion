const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config()

const URI = process.env.MONGODB_URI;
const DB_NAME = "clearfashion"

var client = null;
var db = null;
var connected = false;
var products = require('./products/products.json');


async function OpenConnection(MONGODB_URI = URI, MONGODB_DB_NAME = DB_NAME) {
    try {
        client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
        db = client.db(MONGODB_DB_NAME);
        console.log(` ✅ Connected To MongoDB`);
        connected = true;
    } 
    catch(e) {
        console.log(` ❌  Connection Failed`);
        console.error(e);
    }
}

async function CloseConnection(client){
    await client.close();
    connected = false;

    console.log(" ⏹  Connection Closed\n\n");
}

async function EstimatedDocumentCount(){
    return await db.collection("products").estimatedDocumentCount();
}


async function InsertDocuments(collectionName = "products", documents = products){

    if(await db.listCollections({ name: db.collection.name }).toArray().length != 0){
        // drop databse if exists
        await db.dropCollection(collectionName);
    }
    
    db.createCollection(collectionName);

    console.log(` 🐣 Inserting ${documents.length} documents in ${collectionName}.`);

    const collection = await db.collection(collectionName);
    await collection.insertMany(documents);
}

async function FindProducts(query = {}, offset = 0, limit = 0, printResults = false) {
    if(connected == true){
        const result = await db.collection("products").find(query)
                                                      .skip(offset)
                                                      .limit(limit)
                                                      .toArray()

        if(printResults){
            console.log(' 🧐 Find:', query);
            console.log(` 📄 ${result.length} documents found:`);
            await result.forEach(doc => console.log(doc));
        }
        return result;
    }
}

async function AggregatesProducts(query = [{}], printResults = false) {
    if(connected == true){
        const result = await db.collection("products").aggregate(query).toArray()

        if(printResults){
            console.log(' 🧐  Aggregate:', query);
            console.log(` 📄  ${result.length} documents found:`);
            await result.forEach(doc => console.log(doc))
            
            
        }
        

        return result;
    }
}



async function main(){
    await OpenConnection(URI, DB_NAME);

    if(connected){
        var result = await FindProducts({}, offset = 126, limit = 12, false);
        console.log(result.length)
        await CloseConnection(client);
    }
}

function productsFromBrand(brand){
    return { brand: `${brand.toUpperCase()}` }
}

function productsLessThan(price){
    return { price: {"$lte" : price} }
}

function productsMoreThan(price){
    return { price: {"$gte" : price} }
}

function productsSortedByPrice(asc = true){
    if (asc = false){
        return [ { $sort : { price : -1} } ]
    }
    return [ { $sort : { price : 1} } ]
}

module.exports.OpenConnection = OpenConnection;
module.exports.CloseConnection = CloseConnection;
module.exports.EstimatedDocumentCount = EstimatedDocumentCount;
module.exports.InsertDocuments = InsertDocuments;
module.exports.FindProducts = FindProducts;
module.exports.AggregatesProducts = AggregatesProducts;