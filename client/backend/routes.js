var Client = require("./models/Clients");
var Provider = require("./models/Providers");

module.exports = function (app) {

  app.get('/documentation', function (req, res) {
    res.sendFile(__dirname + '/swagger-ui-dist/index.html');
  });

  app.get('/swagger.json', function (req, res) {
    res.sendFile(__dirname + '/swagger-ui-dist/swagger.json');
  });

  app.get('/api/clients/get', function (req, res) {

    Client.find({}).populate('providers', '-__v').exec(function (error, clients) {
      if (error) {
        console.error(error);
      }
      console.log(clients);
      res.send({
        clients: clients
      })
    });
  });

  app.post('/api/clients/save', function (req, res) {
    if(req.body._id) {
      Client.findById(req.body._id, 'name', function (error, client) {
        if (error) {
          console.error(error);
        }
        client.name = req.body.name;
        client.email = req.body.email;
        client.phone = req.body.phone;
        client.providers = req.body.providers;
        client.save(function (error) {
          if (error) {
            console.log(error)
          }
          res.send({
            success: true
          })
        })
      })
    }
    else {
      var new_post = new Client(req.body);
      new_post.save(function (error) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          message: 'Client saved successfully!'
        })
      })
    }
  });

  app.post('/api/clients/del', function (req, res) {
    var db = req.db;
    Client.remove({
      _id: req.body._id
    }, function (err, post) {
      if (err)
        res.send(err);
      res.send({
        success: true
      })
    })
  });

  app.get('/api/providers/get', function (req, res) {
    Provider.find({}, 'name', function (error, providers) {
      if (error) {
        console.error(error);
      }
      res.send({
        providers: providers
      })
    }).sort({_id: -1})
  });

  app.post('/api/providers/save', function (req, res) {
    if(req.body._id) {
      Provider.findById(req.body._id, 'name', function (error, provider) {
        if (error) {
          console.error(error);
        }
        provider.name = req.body.name;
        provider.save(function (error) {
          if (error) {
            console.log(error)
          }
          res.send({
            success: true
          })
        })
      })
    }
    else {
      var new_post = new Provider(req.body);
      new_post.save(function (error, data) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          _id: data._id,
          message: 'Provider saved successfully!'
        })
      })
    }
  });

  app.post('/api/providers/del', function (req, res) {
    Provider.remove({
      _id: req.body._id
    }, function (err, post) {
      if (err)
        res.send(err);
      res.send({
        success: true
      })
    })
  });

};
