var models = require('../models/models');
var helpers = require('../helpers');

exports.saveSancion = function (req, res){
  debugger;
  if (helpers.isEmpty(req.body.cedula) && helpers.isEmpty(req.body.tarjProf) && helpers.isEmpty(req.body.nombres) &&
      helpers.isEmpty(req.body.PrimApellido) && helpers.isEmpty(req.body.SegApellido) && helpers.isEmpty(req.body.profesion) ) {
    models.profesionales.create({identificacion :req.body.cedula,TarjProf : req.body.tarjProf,nombres : req.body.nombres,
        apellidos : {primero: req.body.PrimApellido,segundo:req.body.SegApellido},profesion : req.body.profesion,inhabil : req.body.inhabil
    }, function (err, profesional){
      if (err) {
        if(err.code=="11000"){
          var conditions = {identificacion:req.body.cedula};
          models.profesionales.findOne(conditions, function  (err, doctor) {
            if (err) {
              res.send('error');
            }else{
                doctor.TarjProf = req.body.tarjProf;
                doctor.nombres =req.body.nombres;
                doctor.apellidos= {
                    primero: req.body.PrimApellido,
                    segundo:req.body.SegApellido
                };
                doctor.profesion = req.body.profesion;
                doctor.inhabil = req.body.inhabil;
              doctor.save(function  (err, doctorID){
                console.log('---- guardado con exito-------')
                  if(!err){
                    models.sancionesAplicadas.create({
                      _sancion : req.body.sancion,
                      _profesional : doctorID._id
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
                            var datos={
                              cedula:req.body.cedula,
                              estado:req.body.inhabil,
                              obs:req.body.observaciones
                            }
                            enviarSecretaria(datos, res);
                          }
                        });
                      }
                    });
                  }else{
                    res.send('error');
                  }
                });
              }
            });
        }else{
          console.log(err);
          res.send(err);
        }
      }else{
        models.sancionesAplicadas.create({
          _sancion : req.body.sancion,
          _profesional : profesional._id
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
                var datos={
                  cedula:req.body.cedula,
                  estado:req.body.inhabil,
                  obs:req.body.observaciones
                }
                enviarSecretaria(datos, res);
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

function enviarSecretaria(datos, res){
  var data = JSON.stringify({
    'estado':datos.estado,
    'observaciones':datos.obs
  });
  var options = {
        host: 'secretariadesalud-cordoba.herokuapp.com',
        // host: 'localhost',
        // port: 4000,
        path: '/medicos/'+datos.cedula+'/estado',
        method: 'PUT',
        headers : {
          'Content-Type': 'application/json; charset=utf-8'
        }
      };
      var http = require("http");
      var httpreq = http.request(options, function (response) {
        response.on('data', function (chunk) {
          console.log("body: " + chunk);
        });
        response.on('end', function(e) {
          console.log(e);
          res.send({error:null, status:"ok", info: "Data sent to secretary successfully"});
        });
        response.on('error', function(e) {
          console.log("Ha ocurrido un error");
          console.log(e);
          res.send({error:e});
        });
      });
      httpreq.write(data);
      httpreq.end();
}

exports.servicioSancion = function (req, res){
  res.header("Access-Control-Allow-Origin", "*");
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

exports.getMedicoById=function(req, res){
  models.profesionales.findOne({identificacion:req.params.id}, function(err, doctor){
    if (err) {
      res.send(err);
    }else{
      res.send({doctor:doctor});
    }
  });
}