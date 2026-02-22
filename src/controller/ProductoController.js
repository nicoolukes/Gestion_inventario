

class ProductoController {
    constructor(productoService) {
        this.productoService = productoService
    }

    async agregarProducto(req, res) {
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
            const mensaje = await this.productoService.agregarProducto(dataProduct);
            res.status(201).json(mensaje);
        }catch{
            res.status(500).json({erro: "Error al cargar el producto"})
        }
        
    }

    async modificarProducto(req, res){
        try{
            const rutaImagen = req.file ? `/imagenes/${req.file.filename}` : null;
            const {id} = req.params;
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
            const mensaje = await this.productoService.agregarProducto(id, dataProduct);
            return res.status(200).json(mensaje);
        }catch{
            res.status(500).json({erro: "Error al modificar el producto"})
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