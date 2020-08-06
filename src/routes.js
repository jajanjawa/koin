const express = require('express');
const api = express.Router();
const dogeApi = require('./api/doge-api');

api.use(express.json());

// DOGECOIN
api.get('/doge/address', dogeApi.generateAddress);
api.post('/doge/send', dogeApi.send);

module.exports = api;
