const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// crear un nuevo usuario
router.post('/new', [
    check('name', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos // le estoy pasando una referencia no la estoy ejecutando validarCampos()
],crearUsuario); // enviando como una respuesta


//router.post( route, middleware, controlador )
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
],loginUsuario);


router.get('/renew', validarJWT ,revalidarToken);

module.exports = router;