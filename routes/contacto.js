const { Router } = require('express');
const { check } = require('express-validator');
const { crearContacto } = require('../controllers/contacto');
// const { validarJWT } = require('../helpers/validar-jwt'); //Activarlo en caso de usar la validacion de token en alguna ruta
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post( '/new', [
    // validarJWT,  endpoint que verifica token para que no se hagan suscripciones anonimas
    check( 'nombre', 'El nombre debe tener un mínimo de 3 caracteres y un máximo de 20' )
        .isLength({
            min: 3,
            max: 20
        }),
    check( 'email', 'El email es obligatorio' )
        .isEmail(),
    check( 'mensaje', 'El mensaje debe contener entre 15 y 256 caracteres' )
        .isLength({
            min: 15,
            max: 256
        }),
    validarCampos
], crearContacto )

module.exports = router;