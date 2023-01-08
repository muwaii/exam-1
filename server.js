const express = require('express');
const randomstring = require('randomstring');
const mongodb = require('mongodb');

const app = express();

app.use(express.text({type: '*/*'})) // chage payload that was sent to string
app.use(express.static(__dirname));

// Connect database
let database;
const mydb = 'mongodb://localhost:27017/';
(async () => {
    const mongoClient = mongodb.MongoClient;
    const dbConnection = await mongoClient.connect(mydb);
    database = dbConnection.db('exam-one');
})();

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