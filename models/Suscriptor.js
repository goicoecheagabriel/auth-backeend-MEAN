const { Schema, model } = require("mongoose");


const SuscriptorSchema = Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    origen: {
        type: String
    },
    validado: {
        type: Boolean,
        default: false
    },
    aceptaPublicidad: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Suscriptor', SuscriptorSchema);