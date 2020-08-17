const { createUser, changePassword } = require('../services/ldap');

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
  },

  change_password: async function(req, res) {
    console.log(req.body);
    if (! req.body.hasOwnProperty('password'))
      return res.status(400)
        .send('Atributo  `password` não encontrado na requisição');
    let newPassword = req.body.password;
    let email = req.params.email;
    let r = await changePassword(email, newPassword);
    (r) ? res.status(200).end() : res.status(401).end();
  }

};

