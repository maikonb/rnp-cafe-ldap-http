var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.use( require('./routes/users') );
app.use( require('./routes/test-api') );

app.listen(8080)
