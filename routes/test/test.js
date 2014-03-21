var models = require('../models/models');
var helpers = require('../test/test');

exports.estados = function (req, res){
  var estados = ['Impuesta', 'Aplicacion', 'Ratificada', 'Modificada', 'Cumplida'];
  for (var i = 0;  i < estados.length; i++) {
      var estado = new models.estados({
        nombre : estados[i]
      });
      estado.save(function(err){
        if(err){
          res.send(err);
        }
      });
      console.log(estado._id);
    };
  res.send(200);
}

exports.sanciones = function (req, res){
  var sanciones = ['Infracción a la ley', 'Mala practica', 'Abuso a su titulo'];
  for (var i = 0;  i < sanciones.length; i++) {
      var sancion = new models.sanciones({
        nombre : sanciones[i]
      });
      sancion.save(function(err){
        if(err){
          res.send(err);
        }
      });
      console.log(sancion._id);
    };
  res.send(200);
}