const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

productoSchema = new Schema({
	nombre: {type: String, required: [true, 'El nombre es necesario']},
	precioUni: {type: Number, required: [true, 'El precio unitario es requerido']},
	description: {required: false, type: String},
	disponible:{type: Boolean, default: true, required: false},
	img:{type: String, required: false},
	categoria:{type: Schema.Types.ObjectId, ref: 'Categoria', required: true},
	usuario:{type: Schema.Types.ObjectId, ref: 'Usuario'}
});

productoSchema.plugin(uniqueValidator, {message: '{PATH} no disponible'});

module.exports = mongoose.model('Producto', productoSchema);