const fs = require('fs');
const path = require('path');
const ErrorsFactory = require('../errors/ErrorsFactory');

class ProductoService {
    constructor(productoRepository) {
        this.productoRepository = productoRepository
    }

    async agregarProducto(dataProduct) {

        const mensaje = await this.productoRepository.agregarProducto(dataProduct);
        return mensaje;
    }

    async modificarProducto(id, dataProduct) {
        
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
        
        const productoEliminado = await this.productoRepository.eliminarProducto(id);

        if (productoEliminado.imagen) {
            const rutaImagen = path.join(__dirname, '../../public', productoEliminado.imagen);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen); // Borra el archivo
            }
        }
        return productoEliminado;
    }

    async buscarProducto(nombre, categoria) {
        const producto = 0;
        if (!nombre && !categoria) {
            producto = await this.productoRepository.listarProducto();
            return producto.map(p => {
                return {
                    ...p,
                    URL_img: `http://localhost:3000${p.imagen}`
                }
            });
        }

        producto = await this.productoRepository.buscarProducto(nombre, categoria);
    }
}

module.exports = ProductoService;