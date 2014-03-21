var models = require('../models/models');
var helpers = require('../helpers');

exports.saveSancion = function (req, res){
  if (helpers.isEmpty(req.body.cedula) && helpers.isEmpty(req.body.tarjProf) && helpers.isEmpty(req.body.nombres) &&
      helpers.isEmpty(req.body.PrimApellido) && helpers.isEmpty(req.body.SegApellido) && helpers.isEmpty(req.body.profesion) &&
      helpers.isEmpty(req.body.duracion)) {
    models.profesionales.create({
        identificacion :req.body.cedula,
        TarjProf : req.body.tarjProf,
        nombres : req.body.nombres,
        apellidos : {
          primero: req.body.PrimApellido,
          segundo:req.body.SegApellido
        },
        profesion : req.body.profesion,
        inhabil : req.body.inhabil
    }, function (err, profesional){
      if (err) {
          if(err.code=="11000"){
            res.send('repeat');
          }else{
            console.log(err);
            res.send(err);
          }
      }else{
        models.sancionesAplicadas.create({
          _sancion : req.body.sancion,
          _profesional : profesional._id,
          duracion : req.body.duracion
        }, function (err, sancionAplicada){
          if (err) {
            res.send(err);
          }else{
            models.sancionesEstados.create({
              _sancionAplicada : sancionAplicada._id,
               _estado : req.body.estado,
               fechaHora : new Date(),
               observaciones : req.body.observaciones
            }, function (err, sancionEstado){
              if(err){
                res.send(err);
              }else{
                res.send(200);
              }
            });
          }
        });
      }
    });
  }else{
    res.send('Faltan datos');//106425 //12548
  }
}

exports.servicioSancion = function (req, res){
  res.header("Access-Control-Allow-Origin", "http://localhost:2500");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var ide = req.params.id;
  // if(req.query.token == "12345"){
    res.type('application/json');
    models.profesionales.findOne({identificacion:ide},function (err, profesional){
      if (err) {
        res.send(err);
      }else{
        if (!profesional) {
          res.json({resp:'no'});
        }else{
          if (profesional.inhabil==='si') {
            res.json({resp:'si'});
          }else{
            res.json({resp:'no'});
          }
        }
      }
    });
    // }else{
    //   res.send(401);
    // }
}