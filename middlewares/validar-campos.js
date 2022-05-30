const { request, response } = require("express");
const { validationResult } = require("express-validator");


// middleware customizado para utilizar en cada endpoint que necesite
// un middleware personalizado recibe 3 parametros req, res, next
const validarCampos = (req = request, res = response, next) => {


    const errors = validationResult( req );

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped() 
        })
    }

    next(); // continua la ejecución del siguiente middleware
}

module.exports = {
    validarCampos
}