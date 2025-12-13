const db = require('../database/DataBase');

// =========================================================
// Crear Clase (solo profesores verificados)
// =========================================================
const CrearClase = (req, res) => {
  const ProfesorId = req.user?.id; // <-- viene del JWT
  const { NombreMateria, Curso, GrupoTaller, Cuatrimestre } = req.body;

  if (!NombreMateria || !Curso || !Cuatrimestre) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const cuatrimestresValidos = ["Primero", "Segundo"];
  if (!cuatrimestresValidos.includes(Cuatrimestre)) {
    return res.status(400).json({ mensaje: "El cuatrimestre debe ser 'Primero' o 'Segundo'" });
  }

  const BuscarUsuario = `
    SELECT * FROM Usuario
    WHERE Id = ? AND Rol = 'Profesor' AND Verificado = 1
  `;

  db.get(BuscarUsuario, [ProfesorId], (err, usuario) => {
    if (err) return res.status(500).json({ mensaje: "Error del servidor" });
    if (!usuario)
      return res.status(403).json({ mensaje: "Solo profesores verificados pueden crear clases" });

    const InsertarClase = `
      INSERT INTO Clase (NombreMateria, Curso, GrupoTaller, Cuatrimestre, ProfesorId)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      InsertarClase,
      [NombreMateria, Curso, GrupoTaller || null, Cuatrimestre, ProfesorId],
      function (err2) {
        if (err2) return res.status(500).json({ mensaje: "Error al crear la clase" });

        return res.status(201).json({
          mensaje: "Clase creada con éxito",
          ClaseId: this.lastID
        });
      }
    );
  });
};

// =========================================================
// Listar TODAS las clases (admin opcional)
// =========================================================
const ListarClases = (req, res) => {
  const sql = `SELECT * FROM Clase`;

  db.all(sql, [], (err, filas) => {
    if (err) return res.status(500).json({ mensaje: "Error al listar clases" });
    res.status(200).json({ Clases: filas });
  });
};

// =========================================================
// Obtener una clase por ID
// =========================================================
const ObtenerClase = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM Clase WHERE Id = ?`;

  db.get(sql, [id], (err, fila) => {
    if (err) return res.status(500).json({ mensaje: "Error del servidor" });
    if (!fila) return res.status(404).json({ mensaje: "Clase no encontrada" });
    res.status(200).json({ Clase: fila });
  });
};

// =========================================================
// Editar Clase (solo el profesor creador)
// =========================================================
const EditarClase = (req, res) => {
  const ProfesorId = req.user.id;
  const { id } = req.params;
  const { NombreMateria, Curso, GrupoTaller, Cuatrimestre } = req.body;

  if (!NombreMateria || !Curso || !Cuatrimestre) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }

  const VerificarPropietario = `
    SELECT * FROM Clase
    WHERE Id = ? AND ProfesorId = ?
  `;

  db.get(VerificarPropietario, [id, ProfesorId], (err, clase) => {
    if (err) return res.status(500).json({ mensaje: "Error del servidor" });
    if (!clase)
      return res.status(403).json({ mensaje: "No puedes editar una clase que no es tuya" });

    const sql = `
      UPDATE Clase
      SET NombreMateria = ?, Curso = ?, GrupoTaller = ?, Cuatrimestre = ?
      WHERE Id = ?
    `;

    db.run(sql,
      [NombreMateria, Curso, GrupoTaller || null, Cuatrimestre, id],
      function (err) {
        if (err) return res.status(500).json({ mensaje: "Error al editar la clase" });
        res.status(200).json({ mensaje: "Clase editada con éxito" });
      }
    );
  });
};

// =========================================================
// Eliminar clase (solo el profesor creador)
// =========================================================
const EliminarClase = (req, res) => {
  const ProfesorId = req.user.id;
  const { id } = req.params;

  const VerificarPropietario = `
    SELECT * FROM Clase
    WHERE Id = ? AND ProfesorId = ?
  `;

  db.get(VerificarPropietario, [id, ProfesorId], (err, clase) => {
    if (err) return res.status(500).json({ mensaje: "Error del servidor" });
    if (!clase)
      return res.status(403).json({ mensaje: "No puedes eliminar una clase que no es tuya" });

    const sql = `DELETE FROM Clase WHERE Id = ?`;

    db.run(sql, [id], function (err) {
      if (err) return res.status(500).json({ mensaje: "Error al eliminar la clase" });
      res.status(200).json({ mensaje: "Clase eliminada con éxito" });
    });
  });
};

// =========================================================
// Listar clases del profesor logueado
// =========================================================
const ListarClasesPorProfesor = (req, res) => {
  const ProfesorId = req.user.id;

  const sql = `SELECT * FROM Clase WHERE ProfesorId = ?`;

  db.all(sql, [ProfesorId], (err, filas) => {
    if (err) return res.status(500).json({ mensaje: "Error al listar clases" });
    res.status(200).json({ Clases: filas });
  });
};

module.exports = {
  CrearClase,
  ListarClases,
  ObtenerClase,
  EditarClase,
  EliminarClase,
  ListarClasesPorProfesor,
};