const mongoose = require('mongoose')

const { hash, compare } = require('bcryptjs')

const { Schema } = mongoose

const fields = {
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { type: String, required: true, trim: true, min: 6 },
  role: { type: String, required: true, trim: true, default: 'empleado' }
}

const user = new Schema(fields, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

user
  .virtual('name')
  .get(function getName () {
    return `${this.nombre}${this.apellidos}`
  })
  .set(function setName (name) {
    const [nombre = '', apellidos = ''] = name.split(' ')
    this.nombre = nombre
    this.apellidos = apellidos
  })

const hiddenFields = ['password']

user.methods.toJSON = function toJSON () {
  const doc = this.toObject()
  hiddenFields.forEach((field) => {
    if (Object.hasOwnProperty.call(doc, field)) {
      delete doc[field]
    }
  })

  return doc
}

user.pre('save', async function save (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
  next()
})

user.methods.verifyPassword = function verifyPassword (password) {
  return compare(password, this.password)
}

module.exports = {
  Model: mongoose.model('user', user),
  fields
}
