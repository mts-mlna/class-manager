const db = require('../database/DataBase');

const CrearAlumno = (req, res) => {
  const { Nombre, Genero } = req.body;

  if (!Nombre) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  const sql = `INSERT INTO Alumno (Nombre, Genero) VALUES (?, ?)`;

  db.run(sql, [Nombre, Genero || null], function (err) {
    if (err) {
      return res.status(500).json({ mensaje: "Error al crear alumno" });
    }

    res.status(201).json({
      mensaje: "Alumno creado correctamente",
      Id: this.lastID,
      Alumno: {
        Id: this.lastID,
        Nombre,
        Genero: Genero || null
      }
    });
  });
};

const ListarAlumnos = (req, res) => {
  const sql = `SELECT Id, Nombre, Genero FROM Alumno ORDER BY Nombre`;
  db.all(sql, [], (err, filas) => {
    if (err) return res.status(500).json({ mensaje: "Error al listar alumnos" });
    res.status(200).json({ Alumnos: filas });
  });
};

const ListarAlumnosPorCurso = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT a.Id, a.Nombre, a.Genero
    FROM AlumnoClase ac
    INNER JOIN Alumno a ON ac.AlumnoId = a.Id
    WHERE ac.ClaseId = ?
    ORDER BY a.Nombre
  `;
  db.all(sql, [id], (err, filas) => {
    if (err) return res.status(500).json({ mensaje: "Error al listar alumnos del curso" });
    res.status(200).json({ Alumnos: filas });
  });
};

const AgregarAlumnoACurso = (req, res) => {
  const { id } = req.params;     // ClaseId
  const { alumnoId } = req.body; // AlumnoId

  if (!alumnoId) return res.status(400).json({ mensaje: "alumnoId es obligatorio" });

  const sql = `INSERT INTO AlumnoClase (AlumnoId, ClaseId) VALUES (?, ?)`;
  db.run(sql, [alumnoId, id], function (err) {
    if (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ mensaje: "El alumno ya está inscripto en este curso" });
      }
      return res.status(500).json({ mensaje: "Error al agregar alumno al curso" });
    }
    res.status(201).json({ mensaje: "Alumno agregado al curso", Id: this.lastID });
  });
};

const EliminarAlumnoDeCurso = (req, res) => {
  const { id, alumnoId } = req.params;
  const sql = `DELETE FROM AlumnoClase WHERE ClaseId = ? AND AlumnoId = ?`;
  db.run(sql, [id, alumnoId], function (err) {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar alumno del curso" });
    if (this.changes === 0) return res.status(404).json({ mensaje: "Alumno no encontrado en el curso" });
    res.status(200).json({ mensaje: "Alumno eliminado del curso" });
  });
};

const CrearAlumnoYAsociar = (req, res) => {
  const { Nombre, Genero } = req.body;
  const { claseId } = req.params; // viene de la URL: /clase/:claseId/alumnos

  if (!Nombre) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  // 1. Crear alumno
  const InsertAlumno = `INSERT INTO Alumno (Nombre, Genero) VALUES (?, ?)`;
  db.run(InsertAlumno, [Nombre, Genero || null], function (err) {
    if (err) {
      return res.status(500).json({ mensaje: "Error al crear el alumno" });
    }

    const alumnoId = this.lastID;

    // 2. Asociar alumno a la clase
    const InsertRelacion = `
      INSERT INTO AlumnoClase (AlumnoId, ClaseId)
      VALUES (?, ?)
    `;

    db.run(InsertRelacion, [alumnoId, claseId], function (err2) {
      if (err2) {
        return res.status(500).json({
          mensaje: "Alumno creado, pero ocurrió un error al asociarlo a la clase"
        });
      }

      // 3. Respuesta final
      res.status(201).json({
        mensaje: "Alumno creado y asociado a la clase correctamente",
        Alumno: {
          Id: alumnoId,
          Nombre,
          Genero: Genero || null
        },
        ClaseId: claseId
      });
    });
  });
};

module.exports = {
  CrearAlumno,
  ListarAlumnos,
  ListarAlumnosPorCurso,
  AgregarAlumnoACurso,
  EliminarAlumnoDeCurso,
  CrearAlumnoYAsociar
};
