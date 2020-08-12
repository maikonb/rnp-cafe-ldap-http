const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const { initializeLdapClient } = require("./services/ldap");

dotenv.config();
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.use( require('./routes/users') );
app.use( require('./routes/test-api') );

initializeLdapClient();

app.listen(8080)
