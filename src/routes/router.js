const express = require('express');
const router = express.Router();
const fs= require("fs")
const path = require("path");
const http = require('http');
const socketIO = require('socket.io');
const {Productos} = require('../controllers/productos.js');
const {Carrito} = require('../controllers/carrito.js');
const { error } = require('console');
const rutaArchivo = path.join(__dirname, "../data/articulos.json");

const productos = new Productos();
const carrito = new Carrito();


//PRODUCTOS
router.get("/productos", async (req, res) => {
    try {
        await productos.cargarProductos();
        res.status(200).json(productos.verProductos());
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Muestro producto por ID
router.get("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await productos.cargarProductos();
        const producto = productos.verProductoPorId(id);
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Elimino producto por ID
router.delete("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await productos.eliminarProducto(id);
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Modifico producto por ID
router.put("/productos/modificar/:id", async (req, res) => { //TENGO QUE VER COMO HAGO PARA QUE SOLO ME MODIFIQUE UN ITEM DEL JSON Y NO ME LOS ELIMINE SI NO LOS TOCO.
    const id = parseInt(req.params.id);
    const nuevoProducto = req.body;
    console.log(req.body); 
    try {
        if (Object.keys(nuevoProducto).length === 0) {
            return res.status(400).json({ message: "Los datos del producto son obligatorios" });
        }
        const modificacionExitosa = await productos.modificarProducto(id, nuevoProducto);
        if (modificacionExitosa) {
            res.status(200).json({ message: "Producto modificado correctamente" });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al modificar el producto:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// CARRITO
// Obtener el contenido completo del carrito
router.get('/carrito', (req, res) => {
    const contenidoCarrito = carrito.getProductos();
    res.status(200).json(contenidoCarrito);
});

// Agregar un producto al carrito por su ID
router.post('/carrito/productos/:id', (req, res) => {
    const { id } = req.params;
    const producto = productos.verProductoPorId(id);
    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }
    if (producto.stock > 0) {
        carrito.agregarProducto(producto);
        res.status(200).send('Producto agregado al carrito correctamente');
        } else {
            res.status(400).send('No hay suficiente stock para este producto');}
    try {
        carrito.agregarProducto(producto);
        res.status(200).send('Producto agregado al carrito correctamente');
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Eliminar un producto del carrito
router.delete('/carrito/eliminar/:id', (req, res) => {
    const { id } = req.params;
    console.log("ID del producto a eliminar:", id);
    console.log("Productos en el carrito:", carrito.getProductos());
    try {
        carrito.eliminarProducto(id);   
        res.status(200).send('Producto eliminado del carrito');
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/carrito/cantidad/producto', (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;
    try {
        carrito.actualizarCantidad(id, cantidad);
        res.status(200).send('Cantidad actualizada en el carrito');
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Obtener el total del carrito
router.get('/carrito/total', (req, res) => {
    try {
        const total = carrito.calcularTotal(); 
        res.status(200).json({ total });
    } catch (error) {
        console.error("Error al calcular el total del carrito:", error);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router
