const express = require('express');
const bodyParser = require('body-parser');
const userrouter = require('./routes/route');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors())
dotenv.config();
app.use('/tasks',userrouter);
app.use('/',userrouter);
module.exports = app;