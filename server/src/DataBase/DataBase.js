const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta absoluta a la base de datos
const dbPath = path.join(__dirname, 'DataBase.db');

// Crear conexión
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error al conectar con SQLite:', err.message);
    } else {
        console.log('✔ Conectado a la base de datos SQLite');
    }
});

module.exports = db;