const express = require('express');
const Carrito = require('./carrito.js');
const carrito = new Carrito();
const router = require('./routes/router.js');
const { Productos } = require('./app.js');
const PORT = 8080
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.listen(PORT, ()=>{
    console.log("server OK en puerto",{PORT})
})

const rutaArchivo = "./articulos.json";
const productos = new Productos(rutaArchivo);

