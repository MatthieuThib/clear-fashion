const { MongoClient } = require('mongodb');

const [,, password] = process.argv;

const MONGODB_URI = `mongodb+srv://cf:${password}@clearfashion.icpqp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
        console.log(` ❌  Connection Failed`);
        console.error(e);
    }
}

async function CloseConnection(client){
    await client.close();
    connected = false;
    
    console.log(" ⏹  Connection Closed\n\n");
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

async function FindProducts(query, printResults = false){
    if(connected == true){
        const result = await db.collection("products").find(query).toArray()

        if(printResults){
            console.log(` 📄  ${result.length} documents found:`);
            await result.forEach(doc => console.log(doc));
        }

        return result;
    }
}

async function main(){
    await OpenConnection(MONGODB_URI, MONGODB_DB_NAME);

    if(connected){
        var query = { price: {"$gte" : 400} }
        await FindProducts(query, true);
        await CloseConnection(client);
    }
}

main();

