const express           = require('express');
const path              = require('path');
const cors              = require('cors');
const { withCors }      = require('./middlewares/withCors');

const { dbConnection }  = require('./db/config');
require('dotenv').config();


// Crear el servidor/aplicacion de express
const app = express();

// Base de datos
dbConnection();

// Directorio Público
app.use(express.static( path.join(__dirname,'public') ));

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() )

// Rutas
app.use( '/api/auth', require('./routes/auth'), withCors ); // Usuarios
app.use( '/api/suscriptor', require('./routes/suscriptor'), withCors ); // Suscriptores
app.use( '/api/contacto', require('./routes/contacto'), withCors ); // Contactos
app.get( '*', ( req, res ) => {
    console.log(path.resolve(__dirname, 'public/index.html'));
    // res.sendFile( path.resolve( __dirname, './public/index2.html' ) );
    res.sendFile( path.join( __dirname, '/public/index.html' ) );
}, withCors )


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
} )