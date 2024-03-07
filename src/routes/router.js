const express = require('express');
const { Productos } = require('../app.js');
const Carrito = require('../carrito.js');
const carrito = new Carrito();
const router = express.Router();
const rutaArchivo = "./articulos.json";
const productos = new Productos(rutaArchivo);


// Muestro productos 
router.get("/productos", async (req, res) => {
    await productos.cargarProductos();
    const todosLosProductos = productos.verProductos();
    res.json(todosLosProductos);
});

// Muestro producto por ID
router.get("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const producto = await productos.verProductoPorId(id);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: "Producto no encontrado" });
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
    // agregar logica de validacion 
    carrito.agregarProducto({ id, cantidad });
    res.send('Producto agregado al carrito');
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
    res.json(contenidoCarrito);
});

// Obtener el total del carrito
router.get('/carrito/total', (req, res) => {
    const total = carrito.calcularTotal(); 
    res.json({ total });
});

module.exports = router
