const path = require("path");
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const { Productos } = require('./app.js');
const { Carrito } = require('./carrito.js');
const router = require('./routes/router.js');

const PORT = 8080;
const app = express();

// Instancias de Productos y Carrito
const productos = new Productos("./articulos.json");
const carrito = new Carrito();

// Middleware

app.use((req, res, next) => {
    console.log("Middleware correcto");
    next();
});
app.use(express.urlencoded({ extended: true }));

// Middleware para cargar productos y carrito en res.locals
app.use(async (req, res, next) => {
    res.locals.productos = await productos.verProductos();
    res.locals.carrito = await carrito.getProductos();
    next();
});

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

// Rutas
app.use(router);

// Servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Eventos de Socket.IO
io.on("connection", socket => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    
    socket.emit('carritoActualizado', carrito.getProductos(), carrito.calcularTotal());

    
    socket.on('agregarAlCarrito', producto => {
        carrito.agregarProducto(producto);
       
        const total = carrito.calcularTotal();
        
        io.emit('carritoActualizado', carrito.getProductos(), total);
    });

});

// Servidor
server.listen(PORT, () => {
    console.log(`Servidor OK en puerto ${PORT}`);
});

// inicio prueba
app.get("/", (req, res) => {
    try {
        res.status(200).render("inicio");
    } catch (error) {
        console.error("Error al renderizar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});