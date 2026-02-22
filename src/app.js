const express = require('express');
const ProductoController = require('./controller/productoController');
const ProductoService = require('./service/ProductoService');
const ProductoRepository = require('./repository/ProductoRepository');
const pool = require('./config/DBConfig')
const imagen = require('./config/MulterConfig')

const app = express();
app.use(express.json());

const productoRepository = new ProductoRepository(pool); 
const productoService = new ProductoService(productoRepository);
const productoController = new ProductoController(productoService);
/*console.log(">>> INTENTANDO REGISTRAR RUTAS <<<");
app.get("/test", (req, res) => {
    res.send("El servidor responde correctamente");
});*/
app.post("/cargarProducto", imagen.single('imagen') ,(req, res) => productoController.agregarProducto(req, res));
app.put("/modificarProducto/:id", imagen.single('imagen'), (req, res) => productoController.modificarProducto(req, res));
app.get("/listarProducto", (req, res) => productoController.listarProducto(req, res));
app.delete("/eliminarProducto/:id", (req, res) => productoController.eliminarProducto(req, res))

module.exports = app;