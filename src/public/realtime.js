//Lado del cliente:

// Falta 
// - Eliminar un producto del carrito
// - Modificar la cantidad del producto
// - Mostrar el total del producto

const socket = io();
// Eventos de Socket.IO
socket.on('bienvenida', mensaje => {
    alert(mensaje);
});
const formulario = document.getElementById('formulario');
const inputMensaje = document.getElementById('mensaje');
const listaMensajes = document.getElementById('mensajes');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = inputMensaje.value;
    inputMensaje.value = '';
    socket.emit('mensaje', mensaje);
});

socket.on('mensaje', (mensaje) => {
    const item = document.createElement('li');
    item.textContent = mensaje;
    listaMensajes.appendChild(item);
});

async function agregarAlCarrito(id) {
    try {
        
        const esperaDeProductos = await fetch`/productos`
        
        const response = await fetch(`/carrito/productos/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        if (response.ok) {
            alert('Producto agregado al carrito correctamente');
            actualizarCarrito();
        } else {
            alert('Error al agregar el producto al carrito');
            console.log('Error al agregar el producto al carrito');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function actualizarCarrito() {
    try {
        const response = await fetch(`/carrito`);
        const data = await response.json();
        const carritoElement = document.getElementById('carrito');
        carritoElement.innerHTML = ''; 

        data.forEach(producto => {
            const listItem = document.createElement('li');
            listItem.textContent = `${producto.titulo} - Precio: ${producto.precio}`;
            carritoElement.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
    }
}


