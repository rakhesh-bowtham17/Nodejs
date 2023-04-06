const express = require('express');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes/route')
const app = express();
const port = 3200;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/',router);
app.use(cors());

dotenv.config();

const filePath = './cdw_ace23_buddies.json';

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

app.listen(port, (res) =>{
    console.log(`Example app listening on port ${port}!`);
})