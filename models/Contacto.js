const { Schema, model } = require("mongoose");

const ContactoSchema = Schema({
    nombre: {
        type: String,
        require: true,
        minLength: [ 3, 'El nombre requiere de 3 caracteres o más.' ]
    },
    email: {
        type: String,
        require: true,
    },
    mensaje: {
        type: String,
        require: true,
        minLength: [ 15, 'Se requiero de un mínimo de 15 caracteres.' ],
        maxLength: [ 256, 'No puede exceder de 256 caracteres.' ]
    },
    origen:{
        type: String
    }
})

module.exports = model('Contacto', ContactoSchema);