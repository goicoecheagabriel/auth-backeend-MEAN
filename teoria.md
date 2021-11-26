# Pasos realizados para crear nuestro backend
1. Primero requerimos el express e igualamos la ejecucion del `express()` a la constante `app`.
2. Luego ejecutamos el metodo `listen` de nuestro `app`.
3. A este metodo le pasamos como primer argumento el numero de puerto donde escuchará el servidor, y como segundo argumento una funión de callback que se dispara cada vez que un usuario se coonecta. En esta solo enviamos un saludo a la consola del backend.
4. Luego configuramos nuestras rutas como un `middlware`. Esto lo realizamos haciendo `app.use`, pasandole como primer argumento un `string` indicando un prefijo para nuestra ruta, y como segundo argumento, el `require` de nuestro archivo de definicion de rutas que guardamos en la carpeta `routes`.
5. El archivo que creamos en la definición de rutas dentro de la carpeta `routes`, se denomina `auth` y contiene una configuracion de router destructuramos desde el modulo express y luego lo asignamos a una constante, `const router = Router()`. Siendo este último el que configuraremos para lograr todas las rutas. Ejemplo: `router.post( '/new', crearUsuario );` Primero llamamos al método que vamos a utilizar, en este caso `post` y a éste le pasamoos dos argumentos, el primeo el `string`que identifica a esta ruta y que se sumará al prefijo mencionado en el punto anterior. El segundo argumento es el método que se ejecutará cuando sea llamada esta ruta. Como puede verse en este argumento se pasa el nombre de la funcion, sin ejecutar con `()` del método que por cuestiones de orden hémos definido en otro archivo.
6. Cada método relacionado a cada ruta, lo hemos construido en un archivo llamado `auth.js` ubicado en la carpeta `controllers`, y cada uno de estos métodos se encuentran exportados en este archivo para poder ser requeridos en el archivo de definicion de rutas.
7. Luego hemos requerido el paquete de `cors` en el `index.js` y lo hemos configurado como middlware de esta manera `app.use( cors() )`. Esta libreria hace que se pueda acceder al backend desde distintos dominios.
8. Hemos configurado también en el `index.js` la posibilidad de recibir json en el body de la requisicion usando el `req.body` de los parametros de los controladores. Para esta configuración tambien usamos un meddleware de la siguiente manera `app.use(express.json())` siendo este un método del express previamente importado.
9. Configuramos el `dotenv` para poder utilizar las variables de entorno. En la raiz de nuestro proyecto creamoso un archivo de solo lectura con el nombre env de la siguiente manera `.env`.  
Dentro de este archivo hemos guardado el siguiente código `PORT=4000`, creando una variable de nombre `PORT` con el valor `4000`. Para poder leerlo haremos el paso siguiente.
10. Lo que buscamos es que las variables que indiquemos dentro del archivo `.env` sean agregadas al `process.env` de nuestra instancia del backend. Para lograr eso utilizaremos y configuraremos la libreria `dotenv` instalada en el `package.json`
En nuestro archivo `index.js` realizaremos el require de dotenv y llamaremos a su método config de la siguiente manera. `require('dotenv).config()`. Con esa configuración básica ya lograremos que las variables definidas en `.env` se encuentren leidas y disponibles en el `process.env` de nuestra instancia de backend.
11. Utilizamos la variable de entorno `PORT` definida en nuestro archivo `.env` en el método listen de nuestra app de la siguiente manera.
```
app.listen(process.env.PORT, () => {
    coonsole.log(`servidor corriendo en el puerto: ${ process.env.PORT }`)
})
```  
De esta manera nuestra aplicacion actualizará su puerto en funcion del valor de la variable PORT indicada en el archivo `.env` definido anteriormente.  
12. Configuramos una carpeta pública para poder desplegar o servir archivos html`s. Por ejemplo una app de Angular.  
Para esto, una vez creada la carpeta public en la raiz del proyecto donde guardaremos los html`s que deseemos servir, usaremos el siguiente middelware en el archivo `index.js`.  
`app.use( express.static('public') )`

13. Luego implementamos el `express-validators`, esto nos va a servir para configurar un middleware que nos permita validar los campos recividos en `req.body`. Para lograrlo lo primero requerimos la librería con el método check en el archivo de las rutas `auth.js` de la siguiente manera `const { check } = require('express-validator');`, luego incorporamos a la ruta que queremos validar el check de forma de middleware como vemos en el siguiente ejemplo para validar los campos `email` y `password`.
```
// Login de usuario
router.post( '/', [
    check( 'email', 'El email es obligatorio' ).isEmail(),
    check( 'password', 'La contraseña es obligatoria' ).isLength( {min:6} ),
], loginUsuario );
```
Como puede observarse se pasa un array de funciones check que contienen como argumentos el nombre de la propiedad a validar, el mensaje que devolverá en caso de error y en cadena se pueden agregar distintos tipos de validaciones.

Luego de hacer esto tendremos tendremos que requerir el método `validationResult` de `express-validator` en el controlador ubicado en `controller/auth.js` de la siguiente manera lo requerimos `const { validationResult } = require('express-validator');` y ya lo podemos usar en el controlador como se muestra a continuacion.
```
...

const loginUsuario = ( req, res = response ) => {

    const errors = validationResult( req );
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }
...
```
De esta manera si el controlador detecta un error dependiendo de la validacion configurada en el middleware hace un `return` con la anterior configuración, de lo contrario avanza con la tarea del controlador.

14. Para facilitar la lectura del codigo y para evitar repetir tantas veces el control de errores , realizaremos un middleware para que se encarge de responder con el error en caso de que lo haya. Para esto crearemos un archivo llamado validar-campos.js en la carpeta middleware quedando asi. `middlewares/validar-campos.js`.
Dentro crearemos el siguiente codigo.
```
const { response } = require("express");
const { validationResult } = require("express-validator");


const validarCampos = ( req, res = response, next ) => {

    const errors = validationResult( req );
    if ( !errors.isEmpty() ){
        return res.status( 500 ).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next();

}

module.exports = {
    validarCampos
}
```
Luego implementaremos el middleware en el archivo de rutas de la siguiente manera.
```
...

const { validarCampos } = require('../middlewares/validar-campos');

...

// Crear un nuevo usuario
router.post( '/new',[
    check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
    check( 'email', 'El email es obligatorio' ).isEmail(),
    check( 'password', 'La contraseña es obligatoria' ).isLength({ min:6 }),
    validarCampos
], crearUsuario );

...

```
Lo único que nos queda es eliminar el codigo puesto anteriormente dentro del controlador.

```
...

const loginUsuario = ( req, res = response ) => {
    ...

    /* Código a ELIMINAR
    const { validationResult } = require("express-validator");
    */
    ...

    /* El codigo comentado es ELIMINADO en el controlador
    const errors = validationResult( req );
    if ( !errors.isEmpty() ){
        return res.status( 500 ).json({
            ok: false,
            errors: errors.mapped()
        })
    }
     */

    return res.json({
        ok: true,
        msg: 'Login de usuario /'
    })
}

...
```
15. En este punto conectaremos nuestro backend a una base de datos de Mongo Atlas. Para esto debemos de disponer de una cuenta en Atlas y un cluster activo. Creamos un usuario y una contraseña para crear nuestra cadena de coneccion. Una vez que dispongamos de la cadena completa de coneccion haremos lo siguiente.  
    + Abrimos el archivo `.env` y agregamos la siguiente variable con la cadena de conección `BD_CNN=mongodb+srv://MEAN_USER:wwr3dJ0VbPKxP4Lo@micluster.d8avp.mongodb.net/miBaseDatos`.
    + Creamos una nueva carpeta en la raiz de nuestro proyecto con el nombre db y dentro un archivo que se llame config.js quedando de la siguiente manera `db/config.js`
    + Luego incluimos el siguiente código para conectarnos a la base de datos de mongo atlas. 
```
    const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.BD_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } );

        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar DB');
    }
}

module.exports = {
    dbConnection
}
```
Con esto dispondremos de una conección que podremos importar en nuestro `index.js` de la siguiente manera.
```
...

const { dbConnection } = require('./db/config');

...

// Base de datos
dbConnection();

...
```
16. Para poder interactuar con nuestra base de datos, debemos crear un modelo de lo que será nuestra entidad fundamental de una coleccion. De alguna manera este modelo representará un documento de una coleccion de mongo atlas. A partir de la definicion este modelo podremos interactuar buscando, creando, actualizando o eliminando documentos de este tipo en nuestra base de datos. Para realizarlo ocupamos los siguiente pasos.
    + crearremos el siguiente archivo en una nueva carpeta de la siguiente manera `models/Usuario.js`.
    + dentro de este archivo agregaremos el siguiente codigo para poder definir nuestro usuario.
```
const { Schema } = require("mongoose");

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model('Usuario', UsuarioSchema);
```
Esto nos permite disponer de un modelo llamado usuario con el Schema que definimos en UserSchema.  

17. En este paso agregaremos el codigo para el controlador de crear nuevos usuarios a la base de datos. Para esto deberemos importar el modelo que creamos antes en el archivo `controllers/auth.js` de la siguiente manera `const Usuario = require('../models/Usuario');` y luego en el controlador `crearUsuario` lo convertiremos en una funcion `async` y le agregaremos el siguiente codigo.
```
const crearUsuario = async ( req, res = response ) => {

    const { email, name, password } = req.body;

    try {

        // Verificar el email que no exista en la base de datos
        let usuario = await Usuario.findOne({ email });
        
        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );


        // Hashear la contraseña


        // Generar el JWT


        // Crear nuevo usuario en la DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name
        })
        
    } catch (error) {
        console.log(error)
        return res.status( 500 ).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    
} 
```
Esto permitirá crear usuarios nuevos en DB siempre y cuando el nuevo usuario no exista con el email que estamos pasando. En caso de que ya exista ese email en algún usuario, el mismo no será creado y devolverá un error.

18. Hashear la contraseña del usuario. Cuando el usuario nos envia la contraseña en el `req.body` para crear su nuevo user. Nosotros deberemos guardar esa contraseña en modo encriptado. JAMAS DEBEREMOS GUARDAR UNA CONTRASEÑA EN DURO, esto evitará que cualquier persona con acceso a la DB pueda ver la contraseña. Para hacer esto utilizaremos el paquete bcrypt importandolo en nuestro archivo auth `controllers/auth.js` y lo haremos de la siguiente manera `const bcrypt = require('bcryptjs');` luego agregaremos el siguiente bloque de codigo en donde habiamos puesto `//hashear la contraseña`.
```
    // Hashear la contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync( password, salt );

```
Esto lo único que hace es crear un hash a partir de la contraseña recibida en el `req.body.password` y reemplazar la propiedad en `dbUser.password` por la misma pero encriptada. Luego en pasos siguientes esta es guardada en DB. El bcrypt.genSaltSync() utilizará 10 vueltas en caso que no se le pasen argumentos, es comunmente aceptado, pero vale aclarar que si ponemos un valor mayo es mas seguro, pero tambien ocupa muchos recursos para poder lograrlo.

19. Generar JsonWebToken: Para lograr esto lo primero que haremos será crearnos un helpers que se encargue de crear el JWT, esto lo haremos en una carpeta de helpers de la siguiente manera en la raiz de la app. `helpers/jwt.js`.
Dentro de este archivo generamos el siguiente código en una función anónima `async` que luego exportaremos.
```
const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    const payload = { uid, name };

    return new Promise(( resolve, reject ) => {
        jwt.sign( payload, process.env.SECRET_JWT_SEED,{
            expiresIn: '24h'
        }, ( err, token ) => {
    
            if ( err ) {
                // TODO MAL
                console.log( err );
                reject( err );
            } else {
                // TODO BIEN
                resolve( token );
            }
    
        } )

    })

}

module.exports = {
    generarJWT
}
```
Si observamos el anterior código podemos ver que hacemos referencia a `process.env.SECRET_JWT_SEED` como segundo parametro de `jwt.sign`, esto es porque necesitamos pasarle una palabra secreta a la funcion de generar token que es usada como semilla para crear el token, este token no se puede re-generar si no tenemos esa clave semilla, por lo que esta es sumamente importante y debe mantenerse lo más secreta posible. Por esta razón la ponemos en una variable de entorno dentro del proceso de la app en el archivo `.env` con la siguiente linea `SECRET_JWT_SEED=EstOdeb3DeSERCompLic402080`.
Por otro lado ya podemos importar nuestra funcion generarJWT parra generar nuestro token en el controller quedando de la siguiente manera.
```
...

const { generarJWT } = require('../helpers/jwt');

...

    // Generar el JWT
    const token = await generarJWT( dbUser.id, dbUser.name );

    // Crear nuevo usuario en la DB
    await dbUser.save();

    // Generar respuesta exitosa
    return res.status(201).json({
        ok: true,
        uid: dbUser.id,
        name,
        token
    })

...
```
20. Login de usuario: Para realizar el login de usuario teniendo en cuenta que el usuario debe hacer match con el email y con el password, considerando que el password se encuentra encriptado. A continuación explicacmos los pasos a realizar y al final ponemos todo el codigo del controller que se encarga de hacer el loginUsuario.  
    + Extraemos email y password de `req.body`.
    + Creamos un bloque `try catch` y definimos su contenido.
        + `try`:  
            + Creamos la constante dbUser y preguntamos a mongodb si el email existe en nuestros registros.
            + Si no existe retornamos `res.status(400)`
            + Si avanzamos es porque existe, entonces creamos `const validPassword = bcrypt.compareSync(password, dbUser.passworrd)` y nos devolverá `true` en caso de que sean iguales o `false` en caso de que no.
            + Ahora verificamos si la comparación es `false` significa que no hay coincidencia y entonces devolvemos `res.status(400)`.
            + Si avanzamos es que nuestra comparación ha devuelto `true`, entonces generamos el token así `const token = await generarJWT(dbUser.id, dbUser.name);`, recordar que tenemos que importar el `generarJWT` del helpers.
            + En este punto ya podemos avanzar en la respuesta del servicio con `res.json({
                ok: true,
                uid: dbUser.id,
                name: dbUser.name,
                token
            })`.
        + `catch`:  
            + imprimimos el error real en consola, para no darle info al usuario sobre el problema que podamos tener. `console.log(error)`.
            + respondemos e informamos del error al usuario de la siguiente manera. `return res.status(500).json({
                ok: false,
                msg: 'Hable y notifique esto a un administrador'
            })`
codigo del controller loginUsuario completo.
```
...

const { generarJWT } = require('../helpers/jwt');

...

const loginUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        //TODO aca podemos grabar los log de acceso del usuario, etc
        const dbUser = await Usuario.findOne( {email} );

        // CONFIRMAMOS SI EL USUARIO HACE MATCH
        if( !dbUser ) {
            
            return res.status(400).json({
                ok: false,
                //TODO: Habilitar el segundo comentario y deshabilitar el primero
                msg: 'El correo no existe.',
                //msg: 'Credenciales no son válidas.'
            })
            
        }

        // CONFIRMAMOS SI EL PASSWORD HACE MATCH
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        //const dbUser = await Usuario.findOne({ password });

        if ( !validPassword ){

            return res.status(400).json({
                ok: false,
                //TODO: Habilitar el segundo comentarios y deshabilitar el primero
                msg: 'El password no es correcto',
                //msg: 'Credenciales no son válidas'
            })
        }

        // GENERAR EL JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // RESPUESTA DEL SERVICIO
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable y notifique esto a un administrador.'
        });
    }
}

...
```
21. Renovar y validar el JWT: 