class VentaControler {
    constructor(ventaService) {
        this.ventaService = ventaService;
    };

    async registrarVenta(req, res, next) {
        try {
            const dataVenta = {
                responsable: req.body.responsable,
                metodo_pago: req.body.metodo_pago,
                detalle: req.body.detalle
            }
            if (!dataVenta.detalle || dataVenta.detalle.length === 0) {
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
            return res.status(201).json(venta);
        } catch (error) {
            next(error);
        }
    }

    async buscarVenta(req, res, next) {
        try {
            const dataVenta = {
                fechaDesde: req.body.fechaDesde,
                fechaHasta: req.body.fechaHasta
            }
            const venta = await this.ventaService.buscarVenta(dataVenta);
            return res.status(201).json(venta);
        } catch (error) {
            next(error);
        }
    }

    async eliminarVenta(req, res, next) {
        try {
            const { id } = req.params;
            if (!id || isNaN(id)) {
                throw Error.badRequest("El id es invalido")
            }
            const mensaje = await this.ventaService.eliminarVenta(id);
            return res.status(201).json(mensaje);
        } catch (error) {
            next(error);
        }
    }
}
module.exports = VentaControler;