const fs = require('fs');
const path = require('path');

let rutaArchivo = path.join(__dirname, '../data/articulos.json');
let articulos = [
    {   
        "id": 1,
        "titulo": "prueba1",
        "descripcion": "Es una prueba",
        "precio": "150",
        "imagen":"imagen",
        "code":"ab1",
        "stock":"10"
    },

    {   
        "id": 2,
        "titulo": "prueba2",
        "descripcion": "Es una prueba",
        "precio": "100",
        "imagen":"imagen",
        "code":"ab2",
        "stock":"50"
    },

    {   
        "id": 3,
        "titulo": "prueba3",
        "descripcion": "Es una prueba",
        "precio": "450",
        "imagen":"imagen",
        "code":"ab3",
        "stock":"15"
    },

    {   
        "id": 4,
        "titulo": "prueba4",
        "descripcion": "Es una prueba",
        "precio": "600",
        "imagen":"imagen",
        "code":"ab4",
        "stock":"80"
    }

]

fs.writeFileSync(rutaArchivo, JSON.stringify(articulos,null,4))

class Productos {
    constructor() {
        this.rutaArchivo = rutaArchivo;
        this.productos = [];
    }

    async cargarProductos() {
        try {
            const contenido = await fs.promises.readFile(this.rutaArchivo, "utf-8");
            this.productos = JSON.parse(contenido);
            return this.productos;
        } catch (error) {
            console.error("Error al cargar productos desde JSON:", error);
        } 
    }
    
    async eliminarProducto(id) {
        const indice = this.productos.findIndex(prod => prod.id === id);
        if (indice !== -1) {
            this.productos.splice(indice, 1);
            await this.guardarProductos();
        } else {
            console.log(`El producto con ID ${id} eliminado.`);
        }
        
    }

    async modificarProducto(id, nuevoProducto) {
        const indice = this.productos.findIndex(prod => prod.id === id);
        if (indice !== -1) {
            this.productos[indice] = { id, ...nuevoProducto };
            await this.guardarProductos();
        } else {
            console.log(`El producto con ID ${id} no existe.`);
        }
        fs.writeFileSync(this.rutaArchivo, JSON.stringify(this.productos, null, 4));
    }


    obtenerIdMasAlto() {
        if (this.productos.length === 0) {
            return 0;
        } else {
            return Math.max(...this.productos.map(prod => prod.id));
        }
    }

    async addProducto(titulo, descripcion, precio, imagen, code, stock) {
        let existe = this.productos.find(prod => prod.code === code);
        if (existe) {
            console.log(`El producto con código ${code} ya existe.`);
            return;
        }

        const nuevoId = this.obtenerIdMasAlto()+1;

        let producto = {
            id: nuevoId,
            titulo: titulo,
            descripcion: descripcion,
            precio: precio,
            imagen: imagen,
            code: code,
            stock: stock
        };

        this.productos.push(producto);
        await this.guardarProductos();

        return producto;
    }

    async guardarProductos() {
        try {
            await fs.promises.writeFile(this.rutaArchivo, JSON.stringify(this.productos, null, 4));
            console.log("Productos guardados correctamente");
        } catch (error) {
            console.error("Error al guardar productos:", error);
        }
    }
    
    verProductos() {
        return this.productos;
    }

    verProductoPorId(id) {
        // Convertir id a número entero
        id = parseInt(id);
        const producto = this.productos.find(u => u.id === id);
        if (!producto) {
            console.log(`No existe producto con ID ${id}`);
            return;
        }
        return producto;
    }
}

module.exports = {Productos};


