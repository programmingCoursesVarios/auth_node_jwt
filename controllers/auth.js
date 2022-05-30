const { request, response }  = require('express');
const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt')


// igualamos para obtener el valor de response
const crearUsuario =  async (req = request, res = response) => {
   

    const { email, name, password } = req.body;

    console.log(email, name, password);

    try {
     // verificar el email
     const usuario = await Usuario.findOne({ email: email })

     if ( usuario ) {
         return res.status(400).json({
             ok: false,
             msg: 'El usuario ya existe con ese email'
         });
     }

     // Crear el usuario con el modelo
     const dbUser = new Usuario( req.body );

     // Hash la contraseña
     const salt = bcrypt.genSaltSync(10); // 10 vueltas para generar dicho salt
     dbUser.password = bcrypt.hashSync( password, salt);
     /**
      * hash de una sola via,
      *     es imposible tener el hash y luego obtener la respuesta  
      *     inclusive si se borrar la contraseña al generar el nuevo hash va a cambiar ya que esta 
      *     vinculada con el salt (numeros aletorios, o tienen que ver con base al tiempo)
      */



     // Generar el JWT
    const token = await generarJWT( dbUser.id, name ); // si todo va  mal retorna el reject y ejecuta el catch
     /**
      * el json de JWT se puede reconstruir vamos a poder ver el contenido de payload
      * lo que no pueden saber es como se firmo este token 
      * 
      * Si el payload y el header no coincide con la firma entonces el token quedá invalido 
      */

     // Crear usuario de DB
     await dbUser.save();

     // Generar respuesta exitosa   
     return res.status(201).json({
         ok: true,
         uid: dbUser.id,
         name,
         token, 
     })
     

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


const loginUsuario = async  (req = request , res = response) => {

    const { email, password } = req.body;

    console.log(email, password);

    try {
        const dbUser = await Usuario.findOne({ email: email });

        // validar si el usuario hace existe
        if (!dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe '
            });
        }

        // Confirmar si el password hace match
        const validarPassword = bcrypt.compareSync( password, dbUser.password );
        /**
         * si una contraseña con hash haría match con otra contraseña de la base de datos que esta encryptada
         *    como la función es Sync: retornará un (true, false)
         */
        if (!validarPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        // generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name ); // si todo va  mal retorna el reject y ejecuta el catch
        

        // Generar respuesta exitosa   
        return res.status(201).json({
             ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token, 
        })        


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async (req, res = response) => {

    /**
     * Renovar y validar JWT
     * el login siempre genera un new token (esta es una autenticación pasiva) 
     *      el backend no mantiene la session activa del usuario de manera que puedo tener
     *      millones de usuarios y hasta que el usuario no envie una petición yo no podré validar este token
     *      
     *      Aquí vamos a recibir el token cada vez que el usuario haga una petición y luego validamos el token
     *      
     *      En cada petición se envia el token: por los queries parmas
     *      con el header, puede ser un token personalizado como 'x-token' o 'api-key'
     */

    const { uid, name } = req;

    // generar el JWT
    const token = await generarJWT( uid, name ); // si todo va  mal retorna el reject y ejecuta el catch    




    return res.status(200).json({
        ok: true,
        uid,
        name
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}