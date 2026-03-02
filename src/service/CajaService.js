const ErrorsFactory = require("../errors/ErrorsFactory");

class CajaService{
    constructor(cajaRepo){
        this.cajaRepo = cajaRepo;
    }

    async movimientoCaja(dataCaja){
        
        const monto = await this.cajaRepo.getSaldo();

        if(dataCaja.tipo === "EGRESO" && monto < dataCaja.monto){
           throw ErrorsFactory.badRequest("No se puede retirar mas dinero del que hay en caja");
        }

        const result = await this.cajaRepo.registrarMovimiento(dataCaja);

        
        return {mensaje:"Moviminto registrado con exito", 
                result
        };

    }

    async obtenerMonto(){
        return await this.cajaRepo.getSaldo();
    }

    async listarMovimiento(){
        return await this.cajaRepo.listarMovimiento();

    }

    async eliminarMovimiento(id){
        const mensaje = await this.cajaRepo.eliminarMovimiento(id);
        return mensaje;
    }

    
}

module.exports= CajaService;