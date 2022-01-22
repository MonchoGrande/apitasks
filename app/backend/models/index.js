const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hojaSchema = Schema({
  Empleado: String,
  Fecha: { type : Date, default: Date.now()},
  L_Interior: {
    type: Boolean,
    default: false,
  },
  L_Exterior: {
    type: Boolean,
    default: false,
  },
  L_Comleto: {
    type: Boolean,
    default: false,
  },
  Repostaje: {
    type: Boolean,
    default: false,
  },
  Traslado: {
    type: Boolean,
    default: false,
  },

  Origen: {
    type: String,
    enum: ['C1', 'C2', 'C8'],
  },
  Destino: {
    type: String,
    enum: ['C1', 'C2', 'C8'],
  },
  Hora_Inicial:{ type : Date, default: Date.now() },
  Hora_Final: { type : Date, default: Date.now() },
  Tiempo: String,
  Matricula: String,
  Clase: String,
});


module.exports = mongoose.model('production', hojaSchema);
