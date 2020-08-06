const express = require('express');
const app = express();

const api = require('./src/routes');

app.use('/v1', api);

app.listen(17845);
