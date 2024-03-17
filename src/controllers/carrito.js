const fs = require('fs');
class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto, cantidad = 1) {
        const productoEnCarrito = this.productos.find(p => p.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            this.productos.push({ ...producto, cantidad });
        }
    }

    eliminarProducto(id) {
        this.productos = this.productos.filter(p => p.id !== id);
    }

    actualizarCantidad(id, nuevaCantidad) {
        const productoEnCarrito = this.productos.find(p => p.id === id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad = nuevaCantidad;
        }
    }

    getProductos() {
        return this.productos;
    }

    calcularTotal() {
        return this.productos.reduce((total, p) => total + (p.precio * p.cantidad), 0);
    }
}

module.exports = {Carrito};