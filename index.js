const http = require('http');
const url = require('url');
const fs = require('fs')
const path = require ('path')

// Cambiar esta función por la lectura del archivo de frutas con fs

function leerFrutas() { 
  const frutasData = [
    { id: 1, nombre: 'manzana', color: 'rojo' },
    { id: 2, nombre: 'banana', color: 'amarillo' },
    { id: 3, nombre: 'naranja', color: 'naranja' },
    { id: 4, nombre: 'uva', color: 'morado' },
    { id: 5, nombre: 'fresa', color: 'rojo' },
    { id: 6, nombre: 'manzana verde', color: 'verde' }
  ];
  console.log("Simulando lectura de frutas...");
  return frutasData;
}


// Crear el servidor HTTP
const servidor = http.createServer((req, res) => {
  // Configurar el header de respuesta como JSON
  res.setHeader('Content-Type', 'application/json');
    const frutas = leerFrutas();
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname
    const partes = pathname.split('/').filter(Boolean);

  // Obtener la ruta de la URL
  const path = url.parse(req.url).pathname;


  

  // 1. '/' - Mensaje de bienvenida
  if (path === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ mensaje: 'Bienvenido a la API de Frutas' }));
    return;
  }

  // 2. '/frutas/all' - Retornar todas las frutas
  if (path === '/frutas/all') {
    res.statusCode = 200;
    res.end(JSON.stringify(frutas));
    return;
  } 

  // 3. '/frutas/id/:id' - Retornar fruta por ID
  if (partes.length === 3 && partes[0] === 'frutas' && partes[1] === 'id') {
    const id = parseInt(partes[2], 10);
    if (isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'ID no válido' }));
      return;
    }
    const fruta = frutas.find(f => f.id === id);
    if (!fruta) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: `Fruta con ID ${id} no encontrada` }));
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify(fruta));
    }
    return;
  }

  // 4. '/frutas/nombre/:nombre' - Retornar frutas por nombre
  if (partes.length === 3 && partes[0] === 'frutas' && partes[1] === 'nombre') {
    const nombreParam = partes[2].toLowerCase();
    const resultados = frutas.filter(f => f.nombre.toLowerCase().includes(nombreParam));
    res.statusCode = 200;
    res.end(JSON.stringify(resultados));
    return;
  }

  // 5. '/frutas/existe/:nombre' - Verificar si una fruta existe por nombre
 if (partes.length === 3 && partes[0] === 'frutas' && partes[1] === 'existe') {
    const nombreParam = partes[2].toLowerCase();
    const existe = frutas.some(f => f.nombre.toLowerCase() === nombreParam);
    res.statusCode = 200;
    res.end(JSON.stringify({ nombre: nombreParam, existe }));
    return;
  }
  
  
  // Por ahora, devolvemos un 404 para todas las rutas
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

// Iniciar el servidor
const PUERTO = 3000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}/`);
  console.log(`Rutas disponibles:`);
  console.log(`- http://localhost:${PUERTO}/`);
  console.log(`- http://localhost:${PUERTO}/frutas/all`);
  console.log(`- http://localhost:${PUERTO}/frutas/id/:id`);
  console.log(`- http://localhost:${PUERTO}/frutas/nombre/:nombre`);
  console.log(`- http://localhost:${PUERTO}/frutas/existe/:nombre`);
});