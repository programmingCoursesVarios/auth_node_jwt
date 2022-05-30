const  jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    const payload = { uid, name };

    // firmar el token necesitare
    // jwt.sign( payload, SECRET_JWT_SEED, { expiresIN } )

    /**
         *     jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h',
        }, (err, token) => {

            if (err) {
                // si hay error quiero enviarle la notificacición

            } else {
                // si todo esta bien  necesito retornar el token
                // pero con este callback no puedo retornarlo de aquí
            }

        })
     */

    // alternativa 2: returnar una promesa, de esa menera puedo obtener el token

    return new Promise( (resolve, reject) => {

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h',
        }, (err, token) => {

            if (err) {
                // si hay error quiero enviarle la notificacición
                console.log(err);
                reject(err);
            } else {
                // si todo esta bien  necesito retornar el token
                // pero con este callback no puedo retornarlo de aquí
                resolve( token );
            }

        })
    });
}

module.exports = {
    generarJWT
}