const express = require('express');
const viewRouter = express.Router();
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

viewRouter.get("/", async (req, res, next) => {
    try {
        const listaProductos = await productos.cargarProductos();
        const contenidoCarrito = carrito.getProductos();
        res.render('inicio', { productos: listaProductos, carrito: contenidoCarrito});
    } catch (error) {
        console.error("Error al cargar la página de inicio:", error);
        res.status(500).send("Error interno del servidor");
    }
});
module.exports = viewRouter;