const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const methodOverride= require('method-override');
const db = require('./config');
const route = require('./routes');

const port = 5000

db.connect();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limmit: "2mb" }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(methodOverride("_method"));

app.listen(port, () =>{
    console.log(`App listening on port ${port}`);
})

route(app)
