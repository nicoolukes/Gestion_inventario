class AppErrors extends Error{
    constructor(mensaje, estadoCode, code){
        super(mensaje);
        this.estadoCode = estadoCode;
        this.code = code;
        this.isOperational= true; // error controlado
    }
}

module.exports = AppErrors;