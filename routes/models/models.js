var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.connect('mongodb://localhost/tribunal');
mongoose.connect('mongodb://<dbuser>:<dbpassword>@dbh62.mongolab.com:27627/tribuanl-etico');
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function callback(){
    console.log('conexion establecida');
    console.log('Database Tribunal');
});

var estadoSchema = new Schema({
  nombre : {type:String, required: true},
  descripcion : {type: String, default:''}
});

var sancionesSchema = new Schema({
  nombre : {type:String, required:true},
  descripcion : {type: String, default:''}
});

var profesionalesSchema = new Schema({
  identificacion : {type: String, required: true, unique:true},
  TarjProf : {type: Number, required: true, unique:true},
  nombres : { type: String, required: true},
  apellidos : {
    primero: {type: String, required: true},
    segundo:{ type:String, required:true}
  },
  profesion : {type:String, required:true},
  inhabil : { type:String, required:true}
});

var sancionesAplicadasSchema = new Schema({
  _sancion : {type: Schema.Types.ObjectId, ref:'sanciones'},
  _profesional : {type:Schema.Types.ObjectId, ref:'profesionales'},
  duracion : {type: Number, required:true}
});

var sancionesEstadosSchema = new Schema({
  _sancionAplicada : {type: Schema.Types.ObjectId, ref:'sancionesAplicadas'},
  _estado : {type: Schema.Types.ObjectId, ref:'estados'},
  fechaHora : {type: Date, required:true},
  observaciones : {type:String, default:''}
});

var estados = mongoose.model('estados', estadoSchema);
var sanciones = mongoose.model('sanciones', sancionesSchema);
var profesionales = mongoose.model('profesionales', profesionalesSchema);
var sancionesAplicadas = mongoose.model('sancionesAplicadas', sancionesAplicadasSchema);
var sancionesEstados = mongoose.model('sancionesEstados', sancionesEstadosSchema);

exports.estados = estados;
exports.sanciones = sanciones;
exports.profesionales = profesionales;
exports.sancionesAplicadas = sancionesAplicadas;
exports.sancionesEstados = sancionesEstados;
