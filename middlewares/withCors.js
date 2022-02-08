const { response } = require('express');

const withCors = ( req, res = response, next ) => {

    // Configurar cabeceras y cors
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    console.log(":::DESDE:withCors",res.header);
    next();

}

module.exports = {
    withCors
}