var  models = require('./models/models');

exports.index = function(req, res){
  models.estados.find(function (err, estado){
    models.sanciones.find(function (err, sancion){
      res.render('index', { title: 'Home', estados:estado, sanciones:sancion});
    });
  });
};