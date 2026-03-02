const Joi = require('joi');

class VentaControler {
    constructor(ventaService) {
        this.ventaService = ventaService;
    };

    async registrarVenta(req, res, next) {
        const dataVenta = Joi.object({
            responsable: Joi.string().required(),
            metodo_pago: Joi.string().required(),
            detalle: Joi.array().items(Joi.object({
                id_producto: Joi.number().required(),
                cantidad: Joi.number().required()
            })).min(1).required()
        })
        try {

            const{error, value} = dataVenta.validate(req.body);

            if(error){
                throw ErrorsFactory.badRequest(error.details[0].message);
            }
            if (!value.detalle || value.detalle.length === 0) {
                throw ErrorsFactory.badRequest("Falta detalle en venta");
            }

            const mensaje = await this.ventaService.registrarVenta(dataVenta);

            return res.status(201).json(mensaje);
        } catch (error) {
            next(error);
        }
    }

    async listarVenta(req, res, next) {
        try {
            const venta = await this.ventaService.listarVenta();
            return res.status(200).json(venta);
        } catch (error) {
            next(error);
        }
    }

    async buscarVenta(req, res, next) {
         const dataVenta = Joi.object({
                fechaDesde: Joi.date().required(),
                fechaHasta: Joi.date().required()
            })
        try {
           
            const{error, value} = dataVenta.validate(req.body);

            if(error){
                throw ErrorsFactory.badRequest(error.details[0].message);
            }

            const venta = await this.ventaService.buscarVenta(value);
            return res.status(200).json(venta);
        } catch (error) {
            next(error);
        }
    }

    async anularVenta(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw Error.badRequest("El id es invalido")
            }
            const mensaje = await this.ventaService.anularVenta(id);
            return res.status(200).json(mensaje);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = VentaControler;