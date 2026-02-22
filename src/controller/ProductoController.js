 
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
            console.error("❌ ERROR REAL:", error); // Esto imprimirá el fallo exacto en tu consola de VS Code
            res.status(500).json({ erro: "Error al cargar", detalle: error.message });
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
            const mensaje = await this.productoService.modificarProducto(id, dataProduct);
            return res.status(200).json(mensaje);
        }catch(error){
            console.error("❌ ERROR REAL:", error); // Esto imprimirá el fallo exacto en tu consola de VS Code
            res.status(500).json({ erro: "Error al modificar", detalle: error.message });
        }
    }

    async listarProducto(req, res){
        try{
            
            const producto = await this.productoService.listarProducto();
            return res.status(200).json(producto);
        }catch (error){
            console.error("❌ ERROR REAL:", error); // Esto imprimirá el fallo exacto en tu consola de VS Code
            res.status(500).json({ erro: "Error al listar", detalle: error.message });
        }
    }

    async eliminarProducto(req, res){
        try{
            const {id}= req.params;
            const mensaje = await this.productoService.eliminarProducto(id);
            return res.status(200).json(mensaje);
        }catch(error){
            console.error("❌ ERROR REAL:", error); // Esto imprimirá el fallo exacto en tu consola de VS Code
            res.status(500).json({ erro: "Error al eliminar", detalle: error.message });
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