module.exports = { 

  add: function (req, res) {
    console.log(req.body);
    res.status(201).send({});
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

