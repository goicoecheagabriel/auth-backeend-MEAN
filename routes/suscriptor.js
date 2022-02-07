const { Router }            = require('express');
const { check }             = require('express-validator');
const { crearSuscriptor }   = require('../controllers/suscriptor');
// const { validarJWT } = require('../helpers/validar-jwt'); //Activarlo en caso de usar la validacion de token en alguna ruta
const { validarCampos }     = require('../middlewares/validar-campos');


const router = Router();

// Creación de un nuevo suscriptor
router.post( '/new', [ 
    // validarJWT,  endpoint que verifica token para que no se hagan suscripciones anonimas
    check( 'name', 'El nombre debe tener un mínimo de 3 caractéres y máximo 20' )
    .isLength({
        min: 3,
        max: 20
    }),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], crearSuscriptor );

module.exports = router;