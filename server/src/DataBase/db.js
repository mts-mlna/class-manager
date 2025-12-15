const sqlite3 = require('sqlite3');
const path = require('path');
const { error } = require('console');

const dbPath = path.join(__dirname, 'DataBase.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error al conectar con SQLite:', err.message);
    } else {
        console.log('✔ Conectado a la base de datos SQLite');
        db.run(
            `
                CREATE TABLE IF NOT EXISTS Usuarios(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    verificado INTEGER NOT NULL DEFAULT 0,
                    tokenEmail TEXT
                )
            `,(error) => {
                if(error){
                    console.error("Error durante la creación de la DB: ", err)
                } else {
                    console.log("DB creada correctamente.")
                }
            }
        )
    }
});

module.exports = db;