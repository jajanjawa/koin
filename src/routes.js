const express = require('express');
const api = express.Router();
const dogeApi = require('./api/doge-api');
const bnbApi = require('./api/bnb-api');

api.use(express.json());

// DOGECOIN
api.get('/doge/address', dogeApi.generateAddress);
api.post('/doge/send', dogeApi.send);

// BINANCE COIN
api.get('/bnb/address', bnbApi.generateAddress);
api.post('/bnb/keystore', bnbApi.generateKeystore);
api.put('/bnb/keystore', bnbApi.unlockKeystore);
api.post('/bnb/send', bnbApi.send);
api.post('/bnb/send/multi', bnbApi.multiSend);


module.exports = api;
