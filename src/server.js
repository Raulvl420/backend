const express = require('express');
const router = require('./routes/router.js');
const { Productos } = require('./app.js');
const PORT = 8080
const app = express()

app.use(router);
app.listen(PORT, ()=>{
    console.log("server OK en puerto",{PORT})
})

const rutaArchivo = "./articulos.json";
const productos = new Productos(rutaArchivo);

