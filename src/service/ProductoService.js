class ProductoService{
    constructor(productoRepository){
        this.productoRepository = productoRepository
    }

    async agregarProducto(dataProduct){

        if((dataProduct.stock && dataProduct.stock_minimo) < 0){
            throw Error("El stock no puede ser negativo")
        }
        if(dataProduct.precio_compra > dataProduct.precio_venta){
            throw Error("El precio de compra no puede ser mayor que el de venta")
        }
        const mensaje = await this.productoRepository.agregarProducto(dataProduct);
        return mensaje;
    }

    async modificarProducto(id, dataProduct){
        if(!id || isNaN(id)){
            throw Error("El id es invalido")
        }
        if((dataProduct.stock && dataProduct.stock_minimo) < 0){
            throw Error("El stock no puede ser negativo")
        }
        if(dataProduct.precio_compra > dataProduct.precio_venta){
            throw Error("El precio de compra no puede ser mayor que el de venta")
        }

        const mensaje = await this.modificarProducto(id, dataProduct);
        return mensaje;
        
    }
}

module.exports= ProductoService;