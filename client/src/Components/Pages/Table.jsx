import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getClassById, createAlumno, getAlumnosByClase, updateAlumno, deleteAlumnos, createAsistencia } from '../../backend/auth.api';
import CustomSelect from '../Items/CustomSelect';
import '../Layouts.css'

function Table() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [clase, setClase] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* popup alumno */
  const [showPopup, setShowPopup] = useState(false);
  const [isEditAlumno, setIsEditAlumno] = useState(false);
  const [alumnoEditId, setAlumnoEditId] = useState(null);

  /* form alumno */
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [genderValue, setGenderValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const genderOptions = ["-", "M", "F", "X"].map(opt => ({
    value: opt === "-" ? "" : opt,
    label: opt
  }));

  const [sortAsc, setSorcAsc] = useState(true);

  const handleSortByName = () => {
    const sorted = [...alumnos].sort((a, b) => {
      if (sortAsc){
        return a.nombre.localeCompare(b.nombre);
      } else {
        return b.nombre.localeCompare(a.nombre);
      }
    });

    setAlumnos(sorted);
    setSorcAsc(!sortAsc);
  };

  const handleClickSP = () => {
    setConfirmAction("sp")
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    if (confirmAction === "guardar") {
      console.log("Se guardaron los cambios")
    }

    if (confirmAction === "sp") {
      console.log("Acción S/P ejecutada")
    }

    setShowConfirm(false)
    setConfirmAction(null)
  }

  const handleMarkPresent = (idAlumno) => {
    setAlumnos(prev =>
      prev.map(a =>
        a.id === idAlumno ? { ...a, checked: !a.checked } : a
      )
    );
  };

  useEffect(() => {
    const sorted = [...alumnos].sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );
    setAlumnos(sorted);
  }, []);

  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const texto = searchText.toLowerCase();

    const resultado = alumnos.filter((alumno) =>
      alumno.nombre.toLowerCase().includes(texto)
    );

    setFilteredStudents(resultado);
  };

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login');
          return;
        }

        const data = await getClassById(id, token);
        setClase(data.clase);
      } catch (err) {
        console.error('ERROR GET CLASS:', err);

        if (err.response?.status === 401) {
          setError('Tu sesión expiró. Vuelve a iniciar sesión.');
        } else if (err.response?.status === 404) {
          setError('La clase no existe o no tienes acceso.');
        } else {
          setError('Error al cargar la clase.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id, navigate]);

  const handleAddAlumno = async () => {
    setError('');

    if (!nombre || !apellido) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await createAlumno(
        id, // 👈 id de la clase (useParams)
        { nombre, apellido, dni, genero: genderValue },
        token
      );

      // limpiar
      setNombre('');
      setApellido('');
      setDni('');
      setGenderValue('');
      setShowPopup(false);
      await fetchAlumnos()

      // (opcional luego) recargar alumnos
    } catch (err) {
      console.error(err);
      setError('Error al agregar alumno.');
    }
  };

  const fetchAlumnos = async () => {
    const token = localStorage.getItem('token');
    const data = await getAlumnosByClase(id, token);
    setAlumnos(data.alumnos.map(a => ({ ...a, checked: false })));
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const data = await getClassById(id, token);
        setClase(data.clase);
        await fetchAlumnos();
      } catch {
        setError('Error al cargar la clase.');
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id, navigate]);

  /* =========================
     CRUD ALUMNOS
  ========================== */
  const handleNewAlumno = () => {
    setIsEditAlumno(false);
    setAlumnoEditId(null);
    setNombre('');
    setApellido('');
    setDni('');
    setGenderValue('');
    setShowPopup(true);
  };

  const handleEditAlumno = (alumno) => {
    setIsEditAlumno(true);
    setAlumnoEditId(alumno.id);
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setDni(alumno.dni || '');
    setGenderValue(alumno.genero || '');
    setShowPopup(true);
  };

  const handleSubmitAlumno = async () => {
    if (!nombre || !apellido) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }

    const token = localStorage.getItem('token');

    if (isEditAlumno) {
      await updateAlumno(
        alumnoEditId,
        { nombre, apellido, dni, genero: genderValue },
        token
      );
    } else {
      await createAlumno(
        id,
        { nombre, apellido, dni, genero: genderValue },
        token
      );
    }

    setShowPopup(false);
    await fetchAlumnos();
  };

  const handleDeleteSelection = async () => {
    const ids = alumnos.filter(a => a.checked).map(a => a.id);
    if (ids.length === 0) return;

    const token = localStorage.getItem('token');
    await deleteAlumnos(ids, token);
    await fetchAlumnos();
  };

  const handleGuardarAsistencia = async () => {
    try {
      const token = localStorage.getItem('token');

      const payload = {
        id_clase: id,
        fecha: now.toISOString().split('T')[0],
        hora: now.toTimeString().split(' ')[0],
        alumnos: alumnos.map(a => ({
          id: a.id,
          presente: !!a.checked
        }))
      };

      await createAsistencia(id, payload, token);

      setSuccessMsg('Se han guardado las asistencias de esta clase correctamente.');
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Error al guardar asistencia');
    }
  };

  if (loading) return <p>Cargando clase...</p>;
  if (error) return <p className="alert-error">{error}</p>;

  return (
    <main className='dashboard-main'>
      <>
        <style>
        {`
          body {
          overflow-y: hidden;
          }
        `}
      </style>
      </>
      <section className='my-class'>
        <div className='my-class-inner'>
          <h1>{clase.nombre}</h1>
          <div className='date-hour'>
            <p>Curso: {clase.curso}</p>
            <p>Taller: {clase.taller}</p>
          </div>
          <div className='date-hour'>
            <p>Fecha: {now.toLocaleDateString()}</p>
            <p>Hora: {now.toLocaleTimeString()}</p>
          </div>
          <div className='date-hour'>
            <p>Cuatrimestre: {clase.cuatrimestre}</p>
          </div>
        </div>
      </section>
      <section className='search-center'>
        <div className='search-inner'>
          <div className='search'>
            <input type="text" name="" id="" placeholder='Escribir el nombre o apellido de un alumno...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <button onClick={handleSearch}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
          </div>
          <div className='header-actions'>
            <button className='erase-selection' onClick={handleDeleteSelection}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>Eliminar selección</button>
            <button className='save-changes larger' onClick={handleNewAlumno}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>Agregar alumno</button>
            <button className='save-changes' onClick={handleGuardarAsistencia}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Guardar</button>
          </div>
        </div>
      </section>
      <section className='table-center'>
        <div className='table-border'>
          <table className='professor-table-assistance'>
            <thead>
              <tr>
                <th>
                </th>
                <th className='student-name-header'>
                  <button onClick={handleSortByName}>
                    <span>Estudiante</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-down"><path d="m21 16-4 4-4-4"></path><path d="M17 20V4"></path><path d="m3 8 4-4 4 4"></path><path d="M7 4v16"></path></svg>  
                  </button>
                </th>
                <th>Género</th>
                <th>Asistencias</th>
                <th>Porcentaje</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td>
                  <label className='professor-checkbox-wrapper'>
                    <input type="checkbox" checked={alumno.checked} onChange={() => handleMarkPresent(alumno.id)} />
                    <span className='custom-checkbox'></span>
                  </label>
                </td>
                <td><span>{alumno.apellido}, {alumno.nombre}</span></td>
                <td>{alumno.genero}</td>
                <td>{alumno.asistenciasAlumno}/{alumno.totalClases}</td>
                <td>{alumno.totalClases > 0 ? Math.round((alumno.asistenciasAlumno / alumno.totalClases) * 100) : 0}%</td>
                <td className='table-actions'>
                  <button className='present' onClick={() => handleMarkPresent(alumno.id)} ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>Presente</button>
                  <button className='options' onClick={() => handleEditAlumno(alumno)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>Editar</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-alumnos">
            <h1>{isEditAlumno ? 'Editar alumno' : 'Agregar alumno'}</h1>
            {error && <p className="alert-error">{error}</p>}
            <div className="popup-form">
              <div>
                <label htmlFor="">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">Apellido</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">DNI (Opcional)</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </div>
              <div className='gender-select'>
                <label htmlFor="">Género</label>
                <CustomSelect options={genderOptions} onChange={(opt) => setGenderValue(String(opt.value))} value={genderValue} placeholder="-"/>
              </div>
            </div>
            <div className="popup-buttons">
              <button className="cancel" onClick={() => setShowPopup(false)}>
                Cancelar
              </button>
              <button className="confirm" type='submit' onClick={handleSubmitAlumno}>
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{successMsg}</p>
            <button
              className="confirm"
              onClick={() => setShowSuccess(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Table
