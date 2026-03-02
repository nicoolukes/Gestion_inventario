const e = require("express");


class ProductoController {
    constructor(productoService) {
        this.productoService = productoService
    }

    async agregarProducto(req, res, next) {
        try {
            const rutaImagen = req.file ? `/imagenes/${req.file.filename}` : null;
            const dataProduct = {
                nombre: req.body.nombre,
                imagen: rutaImagen,
                stock: req.body.stock,
                stock_minimo: req.body.stock_minimo,
                precio_venta: req.body.precio_venta,
                precio_compra: req.body.precio_compra,
                detalle: req.body.detalle,
                categoria: req.body.categoria
            }
            if ((dataProduct.stock && dataProduct.stock_minimo) < 0) {
                throw ErrorsFactory.badRequest("El stock no puede ser negativo")
            }
            if (dataProduct.precio_compra > dataProduct.precio_venta) {
                throw ErrorsFactory.badRequest("El precio de compra no puede ser mayor que el de venta")
            }
            const mensaje = await this.productoService.agregarProducto(dataProduct);
            res.status(201).json(mensaje);
        } catch (error) {
            next(error);
        }

    }

    async modificarProducto(req, res, next) {
        try {
            const rutaImagen = req.file ? `/imagenes/${req.file.filename}` : null;
            const { id } = req.params;
            const dataProduct = {
                nombre: req.body.nombre,
                imagen: rutaImagen,
                stock: req.body.stock,
                stock_minimo: req.body.stock_minimo,
                precio_venta: req.body.precio_venta,
                precio_compra: req.body.precio_compra,
                detalle: req.body.detalle,
                categoria: req.body.categoria
            }
            if (!id || isNaN(id)) {
                throw ErrorsFactory.badRequest("El id es invalido")
            }
            if ((dataProduct.stock && dataProduct.stock_minimo) < 0) {
                throw ErrorsFactory.badRequest("El stock no puede ser negativo")
            }
            if (dataProduct.precio_compra > dataProduct.precio_venta) {
                throw ErrorsFactory.badRequest("El precio de compra no puede ser mayor que el de venta")
            }
            const mensaje = await this.productoService.modificarProducto(id, dataProduct);
            return res.status(200).json(mensaje);
        } catch (error) {
            next(error);
        }
    }

    async listarProducto(req, res, next) {
        try {
            const producto = await this.productoService.listarProducto();
            return res.status(200).json(producto);
        } catch (error) {
            next(error);
        }
    }

    async eliminarProducto(req, res, next) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw ErrorsFactory.badRequest("El id es invalido")
            }
            const mensaje = await this.productoService.eliminarProducto(id);
            return res.status(200).json(mensaje);
        } catch (error) {
            next(error);
        }
    }

    async buscarProducto(req, res, next) {
        try {
            const { nombre, categoria } = req.query;
            const productos = await this.productoService.buscarProducto(nombre, categoria);
            return res.status(200).json(productos);
        } catch (error) {
            next(error);
        }

    }

}
module.exports = ProductoController;

/*
{
    "nombre":"h",
    "imagen":"b",
    "stock":1,
    "stock_minimo":1,
    "precio_venta":2,
    "precio_compra":2,
    "detalle":"c",
    "categoria":"d"
}
*/