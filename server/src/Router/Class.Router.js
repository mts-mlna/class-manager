const express = require("express");
const router = express.Router();

const {
  CrearClase,
  ListarClases,
  ObtenerClase,
  EditarClase,
  EliminarClase,
  ListarClasesPorProfesor
} = require("../Controller/Class.Controller");

const { verificarToken } = require("../Middleware/Auth.Middleware");

// 👉 Crear clase (solo logeado)
router.post("/crear", verificarToken, CrearClase);

// 👉 Listar clases
router.get("/", verificarToken, ListarClases);

// 👉 Ver una clase
router.get("/:id", verificarToken, ObtenerClase);

// 👉 Editar clase
router.put("/editar/:id", verificarToken, EditarClase);

// 👉 Eliminar clase
router.delete("/eliminar/:id", verificarToken, EliminarClase);

// 👉 Listar clases de un profesor
router.get("/profesor/:profesorId", verificarToken, ListarClasesPorProfesor);

module.exports = router;
