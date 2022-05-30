const { default: mongoose } = require("mongoose");


const dbConnection = async () => {
    try {
        mongoose.connect( process.env.BD_CNN, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
            // suseCreateIndex: true
        });

        console.log('Db online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar DB');
    }
}

module.exports = {
    dbConnection
}