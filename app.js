var config = require('./package');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var test = require('./routes/test/test');
var medicos = require('./routes/app/medicos');
var path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.inicio);
app.get('/sanciones', routes.index);
app.post('/medicos/sanciones', medicos.saveSancion);
app.get('/medico/:id', medicos.getMedicoById);
app.get('/SWsancionMedica/:id', medicos.servicioSancion);
// app.get('/estados', test.estados);
app.get('/sanciones', test.sanciones);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
