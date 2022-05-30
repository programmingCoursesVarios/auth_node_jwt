const { request, response } = require("express");
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token',   
        })
    }

    try {

        // Verificar si el token fue firmado con esta misma SECRET_JWT_SEED
        // retorna el payload
        const {uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED );
        console.log(uid, name);

        // quiero enviar la información uid, y name en la petición que le lleva al controlador
        // revalidartoken
        // añadimos los siguientes valores a la request
        req.uid = uid;
        req.name = name;
     
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        })
    }

    /// no olvidar colocar el next() siempre que tenga un middleware personalizado
    next();

}

module.exports = {
    validarJWT
}