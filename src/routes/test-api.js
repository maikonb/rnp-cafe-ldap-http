var express = require('express');
var router  = express.Router();

router.get('/test-api', (req, res) => {
  res.status(200).send({});
});

module.exports = router
