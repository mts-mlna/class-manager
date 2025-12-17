const db = require('../DataBase/db');

const CreateClass = (req, res) => {
  try {
    const { nombre, curso, taller, cuatrimestre } = req.body;

    // 1️⃣ Validar datos obligatorios
    if (!nombre || !curso || !cuatrimestre) {
      return res.status(400).json({
        Error: 'Faltan datos obligatorios para crear la clase.'
      });
    }

    // 2️⃣ Validar cuatrimestre
    if (cuatrimestre !== 'Primero' && cuatrimestre !== 'Segundo') {
      return res.status(400).json({
        Error: 'El cuatrimestre debe ser "primero" o "segundo".'
      });
    }

    // 3️⃣ Obtener id del profesor desde el token
    const id_profesor = req.user.id;
    const tallerFormateado = taller
      ? `${curso[0]}.${taller}`
      : null;

    // 4️⃣ Insertar clase
    const query = `
      INSERT INTO Clases (nombre, curso, taller, cuatrimestre, id_profesor)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [nombre, curso, tallerFormateado || null, cuatrimestre, id_profesor],
      function (err) {
        if (err) {
          console.error('Error al crear la clase:', err);
          return res.status(500).json({
            Error: 'No se pudo crear la clase. Intenta nuevamente más tarde.'
          });
        }

        return res.status(201).json({
          mensaje: 'Clase creada correctamente.',
          clase: {
            id: this.lastID,
            nombre,
            curso,
            taller,
            cuatrimestre
          }
        });
      }
    );

  } catch (err) {
    console.error('ERROR EN CREATE CLASS:', err);
    return res.status(500).json({
      Error: 'Error interno del servidor.'
    });
  }
};

const GetClasses = (req, res) => {
  try {
    const profesorId = req.user.id;

    const query = `
      SELECT 
        id,
        nombre,
        curso,
        taller,
        cuatrimestre
      FROM Clases
      WHERE id_profesor = ?
      ORDER BY nombre ASC
    `;

    db.all(query, [profesorId], (err, rows) => {
      if (err) {
        console.error('Error al obtener clases:', err);
        return res.status(500).json({
          Error: 'Error al obtener las clases.'
        });
      }

      return res.status(200).json({
        clases: rows
      });
    });

  } catch (err) {
    console.error('Error GetMyClasses:', err);
    return res.status(500).json({
      Error: 'Error inesperado en el servidor.'
    });
  }
};

const DeleteClass = (req, res) => {
  try {
    const { id } = req.params;          // id de la clase
    const profesorId = req.user.id;     // del JWT

    if (!id) {
      return res.status(400).json({
        Error: 'ID de la clase no proporcionado.'
      });
    }

    const query = `
      DELETE FROM Clases
      WHERE id = ?
      AND id_profesor = ?
    `;

    db.run(query, [id, profesorId], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          Error: 'Error al eliminar la clase.'
        });
      }

      // 🔒 Seguridad: no existía o no era del profesor
      if (this.changes === 0) {
        return res.status(404).json({
          Error: 'Clase no encontrada o no tienes permiso para eliminarla.'
        });
      }

      return res.status(200).json({
        mensaje: 'Clase eliminada correctamente.'
      });
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      Error: 'Error interno del servidor.'
    });
  }
};

const UpdateClass = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { nombre, curso, taller, cuatrimestre } = req.body;

    if (!nombre || !curso || !cuatrimestre) {
      return res.status(400).json({
        Error: 'Faltan campos obligatorios'
      });
    }

    const query = `
      UPDATE clases
      SET nombre = ?, curso = ?, taller = ?, cuatrimestre = ?
      WHERE id = ? AND id_profesor = ?
    `;

    db.run(
      query,
      [nombre, curso, taller, cuatrimestre, id, userId],
      function (err) {
        if (err) {
          console.error('DB ERROR updateClass:', err);
          return res.status(500).json({
            Error: 'Error al actualizar la clase'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            Error: 'Clase no encontrada'
          });
        }

        return res.status(200).json({
          mensaje: 'Clase actualizada correctamente'
        });
      }
    );
  } catch (err) {
    console.error('ERROR updateClass:', err);
    return res.status(500).json({
      Error: 'Error interno del servidor'
    });
  }
};

const getClassById = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const query = `
      SELECT *
      FROM clases
      WHERE id = ? AND id_profesor = ?
    `;

    db.get(query, [id, userId], (err, clase) => {
      if (err) {
        console.error('DB ERROR getClassById:', err);
        return res.status(500).json({
          Error: 'Error en la base de datos'
        });
      }

      if (!clase) {
        return res.status(404).json({
          Error: 'Clase no encontrada'
        });
      }

      return res.status(200).json({ clase });
    });

  } catch (err) {
    console.error('ERROR GET CLASS BY ID:', err);
    return res.status(500).json({
      Error: 'Error interno del servidor'
    });
  }
};

const createAlumno = (req, res) => {
  try {
    const { id } = req.params;        // id de la clase
    const userId = req.user.id;       // profesor logueado
    const { nombre, apellido, dni } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({
        Error: 'Nombre y apellido son obligatorios'
      });
    }

    // 1️⃣ Verificar que la clase pertenece al profesor
    const checkQuery = `
      SELECT id
      FROM clases
      WHERE id = ? AND id_profesor = ?
    `;

    db.get(checkQuery, [id, userId], (err, clase) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ Error: 'Error interno' });
      }

      if (!clase) {
        return res.status(404).json({
          Error: 'Clase no encontrada o sin permisos'
        });
      }

      // 2️⃣ Insertar alumno
      const insertQuery = `
        INSERT INTO alumnos (nombre, apellido, dni, id_clase)
        VALUES (?, ?, ?, ?)
      `;

      db.run(
        insertQuery,
        [nombre, apellido, dni || null, id],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({
              Error: 'Error al crear alumno'
            });
          }

          res.status(201).json({
            mensaje: 'Alumno creado correctamente',
            alumnoId: this.lastID
          });
        }
      );
    });

  } catch (err) {
    console.error('ERROR createAlumno:', err);
    res.status(500).json({
      Error: 'Error interno del servidor'
    });
  }
};

module.exports = { CreateClass, GetClasses, DeleteClass, UpdateClass, getClassById, createAlumno };