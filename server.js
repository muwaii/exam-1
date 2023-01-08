const express = require('express');
const randomstring = require('randomstring');
const mongodb = require('mongodb');

const ATLAS_URI = "mongodb+srv://order01:cdefgab123@cluster0.xgaq48i.mongodb.net/?retryWrites=true&w=majority"
const app = express();

app.use(express.text({type: '*/*'})) // chage payload that was sent to string
app.use(express.static(__dirname));

let database;
async function connect() {
    try {
        const mongoClient = mongodb.MongoClient;
        const dbConnection = await mongoClient.connect(ATLAS_URI);
        database = dbConnection.db('test01');
        console.log('My MongoDB connected TT');
    } catch(error) {
        console.error(error);
    }
}
connect();


// Go to full url which is mapped with genShort (the link we've made) 
app.get('/:message', async (req, res) => {
    const genShort = req.params.message;
    const result = await database.collection('urls').findOne({ genShort });
    res.redirect(result.url);
});

app.post('/', async (req, res) => {
    const url = req.body;
    const genShort = randomstring.generate(6);
    const obj = { url, genShort};
    await database.collection('urls').insertOne(obj);
    res.send(obj);
});

app.listen(8000, () => console.log('Server is running'));