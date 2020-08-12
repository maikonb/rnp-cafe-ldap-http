var express = require('express');
var router  = express.Router();

const LdapUserController = require('../controllers/ldap-user-controller');

router.get('/users', LdapUserController.all);
router.post('/users', LdapUserController.add);
router.put('/users', LdapUserController.update);
router.post('/users/disable_user', LdapUserController.disable_user);

module.exports = router
