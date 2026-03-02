const ErrorsFactory = require('./../errors/ErrorsFactory')


class VentaService {
    constructor(productoRepo, ventaRepo, cajaRepo, asignacionRepo) {
        this.productoRepo = productoRepo;
        this.ventaRepo = ventaRepo;
        this.cajaRepo = cajaRepo;
        this.asignacionRepo = asignacionRepo;
    }

    async registrarVenta(dataVenta) {

        const client = await this.ventaRepo.pool.connect();

        try {
            await client.query("BEGIN");
            let total = 0;

            const ids = dataVenta.detalle.map(d => d.id_producto);

            const producto = await this.productoRepo.traerProducto(ids, client);

            if (producto.length !== ids.length) {
                throw ErrorsFactory.notFound("Producto no encontrado");
            }

            const productoMap = new Map();
            producto.forEach(p => {
                productoMap.set(p.id_producto, p);
            });

            const detalles = [];

            for (const item of dataVenta.detalle) {
                if (item.cantidad < 0) {
                    throw ErrorsFactory.conflict("cantidad invalida")
                }

                const product = productoMap.get(item.id_producto);

                if (product.stock < item.cantidad) {
                    throw ErrorsFactory.conflict(`Stock insuficiente para ${product.nombre}`)
                }

                const subtotal = item.cantidad * product.precio_venta;
                total = total + subtotal;

                detalles.push({
                    id_producto: product.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: product.precio_venta,
                    nuevoStock: product.stock - item.cantidad
                })
            }

            for (const detalle of detalles) {
                await this.productoRepo.actualizarStock(detalle.nuevoStock, detalle.id_producto, client);
            };

            const venta = {
                total: total,
                metodo_pago: dataVenta.metodo_pago,
                responsable: dataVenta.responsable   
            }

            const idResponsable = await this.asignacionRepo.traerResponsable(venta.responsable);

            if(idResponsable !== venta.responsable){
                throw ErrorsFactory.conflict("El responsable de la venta no es el que esta de turno")
            }

            const ventaResult = await this.ventaRepo.registrarVenta(venta, client);

            for (const detalle of detalles) {
                const dataDetalle = {
                    precio_unitario: detalle.precio_unitario,
                    cantidad: detalle.cantidad,
                    id_venta: ventaResult.id_venta,
                    id_producto: detalle.id_producto
                }

                await this.ventaRepo.registrarDetalle(dataDetalle, client);
            }

            const dataCaja = {
                monto: total,
                detalle: `Venta #${ventaResult.id_venta}`,
                id_venta: ventaResult.id_venta,
                metodo_pago: dataVenta.metodo_pago,
                responsable: dataVenta.responsable
            }

            await this.cajaRepo.registrarMovimiento(dataCaja, client);

            await client.query("COMMIT");

            return {
                ventaResult, total, detalle: detalles
            }

        } catch(error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }

    }

    async listarVenta() {
        const ventas = await this.ventaRepo.listarVenta();

        if (!ventas) {
            throw ErrorsFactory.notFound("No se encontraron ventas");
        }

        return ventas;
    }

    async buscarVenta(dataVenta) {
        if (dataVenta.fechaDesde > dataVenta.fechaHasta && dataVenta.fechaDesde > new Date().toISOString().split('T')[0]) {
            throw ErrorsFactory.badRequest("Fechas invalidas");
        }

        const venta = await this.ventaRepo.buscarVenta(dataVenta);
        return venta;
    }

    async anularVenta(id) {

        const client = await this.ventaRepo.pool.connect();
        
        try{
            await client.query("BEGIN");

            const venta = await this.ventaRepo.traerVenta(id);
            if(venta.length === 0){
                throw ErrorsFactory.notFound("La venta no existe");
            }
            if(venta.estado === "ANULADA"){
                throw ErrorsFactory.conflict("Esta venta ya esta anulada")
            }

            const detalleVenta = await this.ventaRepo.buscarDetalle(venta.id);

            for(const item of detalleVenta){
                const producto = await this.productoRepo.traerProducto(item.id_producto);

                if(producto.length === 0){
                    throw ErrorsFactory.notFound("El producto no existe");
                }

                const stock = producto.stock + item.cantidad
                await this.productoRepo.actualizarStock(stock, producto.id_producto, client);
            }

            const movimientoCaja= await this.cajaRepo.traerMovimiento(venta.id_venta);

            if(movimientoCaja.length === 0){
                throw ErrorsFactory.notFound("El movimiento no existe")
            }

            console.log(movimientoCaja);
            
            await this.cajaRepo.modificarMovimiento(movimientoCaja, client);

            await this.ventaRepo.anularVenta(venta.id_venta);

            await client.query('COMMIT');

            return{mensaje: "Venta anulada correctamente", id }


        }catch(error){
            await client.query('ROLLBACK');
            throw error;
        }finally{
            client.release;
        }

        /*const detalle = await this.ventaRepo.buscarDetalle(id);
        for (const item of detalle) {
            const producto = await this.productoRepo.traerProducto(item.id_producto);

            const stock = producto.stock + item.cantidad;
            await this.productoRepo.actualizarStock(stock, producto.id_producto);
        }
        const mensaje = await this.ventaRepo.eliminarVenta(id);
        return mensaje;*/
    }
}

module.exports = VentaService;