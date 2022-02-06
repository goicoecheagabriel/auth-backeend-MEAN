const express           = require('express');
const path              = require('path');
const cors              = require('cors');

const { dbConnection }  = require('./db/config');
require('dotenv').config();


// Crear el servidor/aplicacion de express
const app = express();

// Base de datos
dbConnection();

// Directorio Público
app.use('/',express.static('public'));

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() )

// Rutas
app.use( '/api/auth', require('./routes/auth') ); // Usuarios
app.use( '/api/suscriptor', require('./routes/suscriptor') ); // Suscriptores
app.use( '/api/contacto', require('./routes/contacto') ); // Contactos
app.get( '*', ( req, res ) => {
    console.log(path.resolve(__dirname, 'public/index.html'));
    // res.sendFile( path.resolve( __dirname, './public/index2.html' ) );
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
} )


app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
} )