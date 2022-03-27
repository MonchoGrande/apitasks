const mongoose = require('mongoose');
const { Schema } = mongoose;

const fields = {
  matricula: {
    type: String,
    trim: true,
  },
  categoria: {
    type: String,
  },
  fecha: {
    type: String,
  },
  aspirado: {
    type: Boolean,
    default: false,
  },
  lavado_manual: {
    type: Boolean,
    default: false,
  },
  tunel: {
    type: Boolean,
    default: false,
  },
  repostaje: {
    type: Boolean,
    default: false,
  },
  checkin: {
    type: Boolean,
    default: false,
  },
  mantenimiento: {
    type: Boolean,
    default: false,
  },
  descripcion: { type: String, default: '', trim: true },
  origen: { type: String, default: null },
  destino: { type: String, default: null },
  hora_inicio: String,
  hora_fin: String,
  tiempo_tarea: String,
};
const references = {
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  groupId: { type: Schema.Types.ObjectId, ref: 'group' },
};
const task = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

module.exports = {
  Model: mongoose.model('task', task),
  fields,
  references,
};
