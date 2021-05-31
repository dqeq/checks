const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const cors           = require('cors');
const db             = require('./config/db');
const app            = express();
const port = 8080;
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cors())

app.use(bodyParser.json());
MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    databaseClient = database.db('cheks')
    require('./routes')(app, databaseClient);
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
})