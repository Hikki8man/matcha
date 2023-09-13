const express = require('express');
const app = express();
const db = require('./dbconnect');

app.use(express.json());
app.listen(3000);
