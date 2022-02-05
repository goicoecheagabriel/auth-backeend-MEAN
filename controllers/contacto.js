const { response } = require('express');
const Contacto = require('../models/Contacto');

const crearContacto = async ( req, res = response ) => {
    const { nombre, email, mensaje, origen } = req.body;
    console.log(":::CREAR:CONTACTO", {...req.body});

    try {
        
        // Crear contacto con el modelo
        const dbContacto = new Contacto( req.body );

        // Crear nuevo contacto en la DB
        await dbContacto.save();

        // Generar respuesta exitosa
        return res.status(201)
            .json({
                ok: true,
                nombre,
                email,
                mensaje,
                origen,
                req:req.body
            })

    } catch (error) {

        console.error( "ERROR:::/Controller/contacto.js:::crearContato()", error );

        return res.status(500)
            .json({
                ok: false,
                msg: 'por favor hable con el administrador. Error de servidor backend.'
            })
        
    }
}

module.exports = {
    crearContacto
}