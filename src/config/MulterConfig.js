const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imagenes');
    },

    filename: (req, file, cb) =>{
        const nombre = Date.now() + '-' + file.originalname;
        cb(null, nombre);
    }
});

const imagen= multer({storage: storage});

module.exports= imagen;