const AppErrors = require('./AppErrors');

class ErrorsFactory{

    static errorInterno() {
        return new AppErrors(
            "Error interno del servidor",
            500,
            "INTERNAL_ERROR"
        );
    }
    //Faltan datos, Formato inválido, Tipo incorrecto, Campo obligatorio ausente
    static badRequest(mensaje = "Dato necesarios"){
        return new AppErrors(mensaje, 400, "REQUEST_INVALID")
    }
    // recursos no existen
    static notFound(mensaje = "No encontrado"){
        return new AppErrors(mensaje, 404, "NOT_FOUND")
    }
    // conflictos
    static conflict(mensaje = "Conflicto de operacion"){
        return new AppErrors(mensaje, 409, "CONFLICT")
    }
}

module.exports = ErrorsFactory;