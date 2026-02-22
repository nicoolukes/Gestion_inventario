const fs = require('fs');
const path = require('path');

class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }

    async agregarProducto(dataProduct) {

        if ((dataProduct.stock && dataProduct.stock_minimo) < 0) {
            throw Error("El stock no puede ser negativo")
        }
        if (dataProduct.precio_compra > dataProduct.precio_venta) {
            throw Error("El precio de compra no puede ser mayor que el de venta")
        }
        const mensaje = await this.productoRepository.agregarProducto(dataProduct);
        return mensaje;
    }

    async modificarProducto(id, dataProduct) {
        if (!id || isNaN(id)) {
            throw Error("El id es invalido")
        }
        if ((dataProduct.stock && dataProduct.stock_minimo) < 0) {
            throw Error("El stock no puede ser negativo")
        }
        if (dataProduct.precio_compra > dataProduct.precio_venta) {
            throw Error("El precio de compra no puede ser mayor que el de venta")
        }

        const mensaje = await this.productoRepository.modificarProducto(id, dataProduct);
        return mensaje;

    }

    async listarProducto() {

        const producto = await this.productoRepository.listarProducto();
        if (!producto || producto.length === 0) {
            return [];
        }
        return producto.map(p => {
            return {
                ...p,
                URL_img: `http://localhost:3000${p.imagen}`
            }
        });
    }


    async eliminarProducto(id) {
        if (!id || isNaN(id)) {
            throw Error("El id es invalido")
        }
        const productoEliminado = await this.productoRepository.eliminarProducto(id);

        if (productoEliminado.imagen) {
            const rutaImagen = path.join(__dirname, '../../public', productoEliminado.imagen);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen); // Borra el archivo
            }
        }
        return productoEliminado;
    }
}

module.exports = ProductoService;