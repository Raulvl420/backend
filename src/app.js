const path = require("path");
const express = require('express');
const http = require('http');
const {Server} = require("socket.io");
const handlebars = require("express-handlebars");
const router = require('./routes/router.js');
const viewRouter = require('./routes/viewRouter.js');
const PORT = 8080;
const app = express();
const rutaArchivo = require("./data/articulos.json")

const { Productos } = require('./controllers/productos.js');
const { Carrito } = require('./controllers/carrito.js');
const productos = new Productos();
const carrito = new Carrito();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use(router);
app.use(viewRouter);

// Servidor HTTP y Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Servidor
server.listen(PORT, () => {
    console.log(`Servidor OK en puerto ${PORT}`);
});

// Eventos de Socket.IO
io.on("connection", socket => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.emit("bienvenida", "¡Bienvenido al sistema!");
    socket.on('mensaje', (mensaje) => {
        console.log('Mensaje recibido:', mensaje);
        socket.emit('mensaje', mensaje); // El mensaje solo al cliente conectado 
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});





