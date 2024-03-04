const express = require('express');
const { Productos } = require('../app.js');
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

module.exports = router
