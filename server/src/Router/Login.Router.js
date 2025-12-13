const Express = require('express');
const Rutas = Express.Router();

const {
RegistrarUsuario,
IniciarSesion,
ListarUsuarios,
EliminarUsuario,
VerificarCuenta
} = require('../Controller/Login.Controller');

const { verificarToken } = require("../Middleware/Auth.Middleware");

// Rutas existentes
Rutas.post('/registrar', RegistrarUsuario);
Rutas.post('/iniciar-sesion', IniciarSesion);
Rutas.get('/usuarios', ListarUsuarios);
Rutas.get('/verificar/:token', VerificarCuenta);
Rutas.delete('/eliminar-usuario/:id', EliminarUsuario);

// 🔹 Nueva ruta → Saber si el usuario está logeado
Rutas.get('/auth/me', verificarToken, (req, res) => {
res.json({ user: req.user });
});

// 🔹 Nueva ruta → Cerrar sesión borrando la cookie
Rutas.post('/auth/logout', (req, res) => {
res.clearCookie("token");
res.json({ mensaje: "Sesión cerrada" });
});

module.exports = Rutas;
