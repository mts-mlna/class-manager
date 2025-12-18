import db from '../DataBase/db.js'

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
    const { nombre, apellido, dni, genero } = req.body;

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
        INSERT INTO alumnos (nombre, apellido, genero, dni, id_clase)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(
        insertQuery,
        [nombre, apellido, genero, dni || null, id],
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

const getAlumnosByClase = (req, res) => {
  try {
    const { id } = req.params;   // id_clase
    const userId = req.user.id; // profesor autenticado

    // 1️⃣ Obtener alumnos de la clase
    const alumnosQuery = `
      SELECT 
        a.id,
        a.nombre,
        a.apellido,
        a.dni,
        a.genero
      FROM alumnos a
      INNER JOIN clases c ON a.id_clase = c.id
      WHERE a.id_clase = ?
        AND c.id_profesor = ?
      ORDER BY a.apellido, a.nombre
    `;

    db.all(alumnosQuery, [id, userId], (err, alumnos) => {
      if (err) {
        console.error('DB ERROR alumnos:', err);
        return res.status(500).json({ error: 'Error al obtener alumnos' });
      }

      // 2️⃣ Total de clases con asistencia tomada
      const totalClasesQuery = `
        SELECT COUNT(*) AS totalClases
        FROM asistencias_clase
        WHERE id_clase = ?
          AND id_profesor = ?
      `;

      db.get(totalClasesQuery, [id, userId], (err, totalRow) => {
        if (err) {
          console.error('DB ERROR totalClases:', err);
          return res.status(500).json({ error: 'Error al obtener total de clases' });
        }

        const totalClases = totalRow?.totalClases || 0;

        // 3️⃣ Asistencias por alumno
        const alumnosPromises = alumnos.map(alumno => {
          return new Promise((resolve, reject) => {
            const asistenciasAlumnoQuery = `
              SELECT COUNT(*) AS asistenciasAlumno
              FROM asistencias_alumnos aa
              INNER JOIN asistencias_clase ac
                ON aa.id_asistencia_clase = ac.id
              WHERE ac.id_clase = ?
                AND ac.id_profesor = ?
                AND aa.id_alumno = ?
                AND aa.presente = 1
            `;

            db.get(
              asistenciasAlumnoQuery,
              [id, userId, alumno.id],
              (err, row) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    ...alumno,
                    asistenciasAlumno: row?.asistenciasAlumno || 0,
                    totalClases
                  });
                }
              }
            );
          });
        });

        Promise.all(alumnosPromises)
          .then(alumnosFinal => {
            res.status(200).json({ alumnos: alumnosFinal });
          })
          .catch(err => {
            console.error('DB ERROR asistenciasAlumno:', err);
            res.status(500).json({ error: 'Error al obtener asistencias' });
          });
      });
    });
  } catch (err) {
    console.error('ERROR getAlumnosByClase:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateAlumno = (req, res) => {
  try {
    const { id } = req.params; // id del alumno
    const { nombre, apellido, dni, genero } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({
        Error: 'Nombre y apellido son obligatorios'
      });
    }

    const query = `
      UPDATE alumnos
      SET nombre = ?, apellido = ?, dni = ?, genero = ?
      WHERE id = ?
    `;

    db.run(
      query,
      [nombre, apellido, dni || null, genero || null, id],
      function (err) {
        if (err) {
          console.error('DB ERROR updateAlumno:', err);
          return res.status(500).json({
            Error: 'Error al actualizar el alumno'
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            Error: 'Alumno no encontrado'
          });
        }

        return res.json({
          mensaje: 'Alumno actualizado correctamente'
        });
      }
    );
  } catch (err) {
    console.error('ERROR updateAlumno:', err);
    return res.status(500).json({
      Error: 'Error interno del servidor'
    });
  }
};

const deleteAlumnos = (req, res) => {
  try {
    const { alumnosIds } = req.body;

    if (!Array.isArray(alumnosIds) || alumnosIds.length === 0) {
      return res.status(400).json({
        Error: 'No se seleccionaron alumnos'
      });
    }

    const placeholders = alumnosIds.map(() => '?').join(',');

    const query = `
      DELETE FROM alumnos
      WHERE id IN (${placeholders})
    `;

    db.run(query, alumnosIds, function (err) {
      if (err) {
        console.error('DB ERROR deleteAlumnos:', err);
        return res.status(500).json({
          Error: 'Error al eliminar alumnos'
        });
      }

      return res.json({
        mensaje: 'Alumnos eliminados correctamente',
        eliminados: this.changes
      });
    });
  } catch (err) {
    console.error('ERROR deleteAlumnos:', err);
    return res.status(500).json({
      Error: 'Error interno del servidor'
    });
  }
};

export const createAsistenciaClase = (req, res) => {
  const userId = req.user.id;
  const { id_clase, fecha, hora, alumnos } = req.body;
  // alumnos = [{ id: 1, presente: true }, ...]

  if (!id_clase || !fecha || !hora || !Array.isArray(alumnos)) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  db.run(
    `INSERT INTO asistencias_clase (id_clase, id_profesor, fecha, hora)
     VALUES (?, ?, ?, ?)`,
    [id_clase, userId, fecha, hora],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error creando asistencia' });
      }

      const asistenciaClaseId = this.lastID;

      const stmt = db.prepare(
        `INSERT INTO asistencias_alumnos
         (id_asistencia_clase, id_alumno, presente)
         VALUES (?, ?, ?)`
      );

      alumnos.forEach(alumno => {
        stmt.run(
          asistenciaClaseId,
          alumno.id,
          alumno.presente ? 1 : 0
        );
      });

      stmt.finalize();

      res.status(201).json({
        mensaje: 'Asistencia guardada correctamente'
      });
    }
  );
};

export { CreateClass, GetClasses, DeleteClass, UpdateClass, getClassById, createAlumno, getAlumnosByClase, updateAlumno, deleteAlumnos };