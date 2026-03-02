const express = require('express');
const errorMiddleware = require('./middleware/errorMiddleware');

/*producto */
const ProductoController = require('./controller/productoController');
const ProductoService = require('./service/ProductoService');
const ProductoRepository = require('./repository/ProductoRepository');

/*Caja*/
const CajaController = require('./controller/CajaController');
const CajaService = require('./service/CajaService');
const CajaRepository = require('./repository/CajaRepository');

/*Venta */
const VentaControler = require('./controller/VentaControler');
const VentaService = require('./service/VentaService');
const VentaRepository = require('./repository/VentaRepository');

/*Asignacion */
const AsignarController = require('./controller/AsignarController');
const AsignarService = require('./service/AsignarService');
const AsignarRepository = require('./repository/AsignarRepository');

const pool = require('./config/DBConfig')
const imagen = require('./config/MulterConfig');



const app = express();
app.use(express.json());


/* Producto*/
const productoRepository = new ProductoRepository(pool); 
const productoService = new ProductoService(productoRepository);
const productoController = new ProductoController(productoService);
/* Caja*/
const cajaRepository = new CajaRepository(pool); 
const cajaService = new CajaService(cajaRepository);
const cajaController = new CajaController(cajaService);
/*Venta*/
const ventaRepository = new VentaRepository(pool);
const ventaService = new VentaService(productoRepository, ventaRepository, cajaRepository);
const ventaController = new VentaControler(ventaService);
/*Asignacion */
const asignarRepository = new AsignarRepository(pool);
const asignarService = new AsignarService(asignarRepository, cajaRepository);
const asignarController = new AsignarController(asignarService)


/*console.log(">>> INTENTANDO REGISTRAR RUTAS <<<");
app.get("/test", (req, res) => {
    res.send("El servidor responde correctamente");
});*/




/*producto*/
app.post("/cargarProducto", imagen.single('imagen') ,(req, res, next) => productoController.agregarProducto(req, res, next));
app.put("/modificarProducto/:id", imagen.single('imagen'), (req, res, next) => productoController.modificarProducto(req, res, next));
app.get("/listarProducto", (req, res, next) => productoController.listarProducto(req, res, next));
app.delete("/eliminarProducto/:id", (req, res, next) => productoController.eliminarProducto(req, res, next));

/*Caja */
app.post("/registrarMovimiento", (req, res, next) => cajaController.movimientoCaja(req, res, next));
app.get("/obtenerSaldo", (req, res, next) => cajaController.obtenerSaldo(req, res, next));
app.get("/listarMovimiento", (req, res, next) => cajaController.listarMovimiento(req, res, next));
app.delete("/eliminarMovimiento/:id", (req, res, next) => cajaController.eliminarMovimiento(req, res, next));

/*Venta */
app.post("/registrarVenta", (req, res, next) => ventaController.registrarVenta(req, res, next));
app.get("/listarVenta", (req, res, next) => ventaController.listarVenta(req, res, next));
app.get("/buscarVenta", (req, res, next) => ventaController.buscarVenta(req, res, next));
app.delete("/eliminarVenta/:id", (req, res, next) => ventaController.eliminarVenta(req, res, next));

/*Asignacion */
app.post("/registrarAsignacion", (req, res, next) => asignarController.registrarAsignacion(req, res, next));
app.put("/modificarAsignacion", (req, res, next) => asignarController.modificarAsignacion(req, res, next));

app.use(errorMiddleware);

module.exports = app;