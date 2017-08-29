const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('views', __dirname + path.sep + 'server' + path.sep + 'views')
app.set('view engine', 'jade');


require('./server/routes')(app);
app.get('*', (req, res) => res.status(404).send({
    message: 'not found',
}));

module.exports = app;
