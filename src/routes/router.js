const path = require("path");
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const router = express.Router();
const {Productos} = require('../app.js');
const {Carrito} = require('../carrito.js');
const rutaArchivo = "./articulos.json";
const carrito = new Carrito();
const productos = new Productos(rutaArchivo);

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//INICIO


// Muestro productos 
router.get("/productos", async (req, res) => {
    try {
        await productos.cargarProductos(); 
        res.status(200).render("productos", { productos: productos.verProductos() });
    } catch (error) {
        console.error("Error al renderizar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Muestro producto por ID
router.get("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const producto = await productos.verProductoPorId(id);
    if (producto) {
        res.render("producto", producto);
    } else {
        res.render("error", { message: "Producto no encontrado" });
    }
});
// Elimino producto por ID
router.delete("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await productos.eliminarProducto(id);
    res.json({ message: "Producto eliminado correctamente" });
});
//Modifico producto por ID
router.put("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const nuevoProducto = req.body; // Los datos del nuevo producto se reciben en el cuerpo de la solicitud
    await productos.modificarProducto(id, nuevoProducto);
    res.json({ message: "Producto modificado correctamente" });
});

router.get("/productos/:start/:limit", async (req, res) => {
    await productos.cargarProductos();
    let startIndex = parseInt(req.params.start);
    let limite = parseInt(req.params.limit);
    const todosLosProductos = productos.verProductos().slice(startIndex, startIndex + limite);
    res.json(todosLosProductos);
});

// AGREGAMOS LAS RUTAS DEL CARRTIO

// Agregar un producto al carrito
router.post('/carrito/productos/:id', (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    // agregar lógica de validación 
    carrito.agregarProducto({ id, cantidad });

    // Emitir evento de WebSocket para informar a todos los clientes que se ha agregado un producto al carrito
    io.emit('productoAgregado', carrito.getProductos());

    res.json({ message: 'Producto agregado al carrito' });
});

// Eliminar un producto del carrito
router.delete('/carrito/productos/:id', (req, res) => {
    const { id } = req.params;
    carrito.eliminarProducto(id);
    res.send('Producto eliminado del carrito');
});

// Actualizar la cantidad de un producto en el carrito
router.put('/carrito/productos/:id', (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    carrito.actualizarCantidad(id, cantidad);
    res.send('Cantidad actualizada en el carrito');
});

// Obtener el contenido completo del carrito
router.get('/carrito', (req, res) => {
    const contenidoCarrito = carrito.getProductos();
    res.render('carrito', { carrito: res.locals.carrito });
});

// Obtener el total del carrito
router.get('/carrito/total', (req, res) => {
    const total = carrito.calcularTotal(); 
    res.json({ total });
});

module.exports = router
