const { createUser } = require('../services/ldap');

module.exports = { 

  add: async function (req, res) {
    let r = await createUser(req.body);
    if (r)
      res.status(201).send({});
    else
      res.status(500).send({});
  },
  
  all: function (req, res) {
    res.status(200).send([]);
  },
  
  update: function (req, res) {
    res.status(200).send({});
  },
  
  disable_user: function (req, res) {
    res.status(200).send({});
  }

};

