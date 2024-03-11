const socket = io();
    socket.on('carritoActualizado', productosEnCarrito => {
    // Actualizar la interfaz de usuario con los productos en el carrito
    console.log('Carrito actualizado:', productosEnCarrito);
    // Por ejemplo, puedes renderizar los productos en el carrito en la página HTML
});


