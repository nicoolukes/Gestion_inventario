const ErrorsFactory = require("../errors/ErrorsFactory");

class CajaController {
    constructor(cajaService) {
        this.cajaService = cajaService;
    }

    async movimientoCaja(req, res, next) {
        try {
            const dataCaja = {
                monto: req.body.monto,
                tipo: req.body.tipo,
                detalle: req.body.detalle,
                responsable: req.body.responsable,
                origen: "MANUAL",
                metodo_pago: req.body.metodo_pago,
                id_venta: null
            }
            if (dataCaja.monto <= 0 ) {
                throw ErrorsFactory.badRequest("El monto no puede ser cero ni negativo")
            }

            if(!dataCaja.responsable || !dataCaja.tipo || !dataCaja.monto || !dataCaja.metodo_pago ){
                throw ErrorsFactory.badRequest("Faltan datos")
            }

            const mensaje = await this.cajaService.movimientoCaja(dataCaja);
            return res.status(201).json(mensaje);
        } catch (error) {
            next(error);
        }
    }

    async listarMovimiento(req, res, next) {
        try {
            const movimientos = await this.cajaService.listarMovimiento();
            return res.status(200).json(movimientos)
        } catch (error) {
            next(error);
        }
    }

    async obtenerSaldo(req, res, next) {
        try {
            const saldo = await this.cajaService.obtenerMonto();
            return res.status(200).json(saldo);
        } catch (error) {
            next(error);
        }
    }

    async eliminarMovimiento(req, res, next) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw ErrorsFactory.badRequest("El id es invalido");
            }

            const mensaje = await this.cajaService.eliminarMovimiento(id);
            return res.status(200).json(mensaje);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = CajaController;

/*{
    "monto": 10000,
    "tipo": "EGRESO",
    "detlle": "Primer ingreso",
    "responsable":1,
    "fecha": "25/02/2026",
    "metodo_pago": "EFECTIVO"
} */