import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getClassById, createAlumno } from '../../backend/auth.api';
import '../Layouts.css'

function Table() {

  const { id } = useParams()
  const navigate = useNavigate();
  const [clase, setClase] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');

  const [students, setStudents] = useState([
    {
      id: 1,
      nombre: "Sánchez, Bruno Ezequiel",
      curso: "7º2ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 2,
      nombre: "Torres, Antu Paladea",
      curso: "7º1ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 3,
      nombre: "Molina, Matias Ezequiel",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 4,
      nombre: "López, Alexis",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 5,
      nombre: "Mamani, Romina Karen",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 6,
      nombre: "Alegre, Luciana",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 7,
      nombre: "Cánchez, Bruno Ezequiel",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 8,
      nombre: "Bánchez, Bruno Ezequiel",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    },
    {
      id: 9,
      nombre: "Ránchez, Bruno Ezequiel",
      curso: "7º4ª",
      grupo: "7.4",
      asistencia: "Ausente",
      checked: false
    }
  ]);

  

  const [sortAsc, setSorcAsc] = useState(true);

  const handleSortByName = () => {
    const sorted = [...students].sort((a, b) => {
      if (sortAsc){
        return a.nombre.localeCompare(b.nombre);
      } else {
        return b.nombre.localeCompare(a.nombre);
      }
    });

    setStudents(sorted);
    setSorcAsc(!sortAsc);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleClickSave = () => {
    setConfirmAction("guardar")
    setShowConfirm(true)
  }

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

  const handleMarkPresent = (id) => {
    setStudents(prev => {
      const updated = prev.map(student =>
        student.id === id ? { ...student, checked: !student.checked } : student
      );
      setFilteredStudents(filtered =>
        filtered.map(student =>
          student.id === id ? { ...student, checked: !student.checked } : student
        )
      );

      return updated;
    });
  };


  useEffect(() => {
    const sorted = [...students].sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );
    setStudents(sorted);
  }, []);

  const [searchText, setSearchText] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);

  const handleSearch = () => {
    const texto = searchText.toLowerCase();

    const resultado = students.filter((alumno) =>
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

  if (loading) {
    return <p>Cargando clase...</p>;
  }

  if (error) {
    return <p className="alert-error">{error}</p>;
  }


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
            <button className='erase-selection'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>Eliminar selección</button>
            <button className='save-changes larger' onClick={() => setShowPopup(true)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>Agregar alumno</button>
            <button className='save-changes' onClick={handleClickSave}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>Guardar</button>
          </div>
        </div>
      </section>
      <section className='table-center'>
        <div className='table-border'>
          <table className='professor-table-assistance'>
            <thead>
              <tr>
                <th>
                  <label className='checkbox-wrapper'>
                  </label>
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
              {students.map(student => (
              <tr key={filteredStudents.id}>
                <td>
                  <label className='professor-checkbox-wrapper'>
                    <input type="checkbox" checked={student.checked} onChange={() => handleMarkPresent(student.id)} />
                    <span className='custom-checkbox'></span>
                  </label>
                </td>
                <td><span>{student.nombre}</span></td>
                <td>M</td>
                <td>25/33</td>
                <td>75%</td>
                <td className='table-actions'>
                  <button className='present' onClick={() => handleMarkPresent(student.id)} ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>Presente</button>
                  <button className='options'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>Editar</button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {showConfirm && (
      <div className="popup-overlay">
        <div className="popup">
          <h2>¿Confirmar acción?</h2>
          <p>
            {confirmAction === "guardar" && "Al confirmar esta acción se guardarán las asistecias e inasistencias. ¿Estás seguro?"}
            {confirmAction === "sp" && "Al confirmar esta acción se te marcará como ausente. Esta clase será eliminada del total de clases del cuatrimestre (pasarán a ser 32 en vez de 33). ¿Quieres continuar?"}
          </p>

          <div className="popup-buttons">
            <button onClick={handleConfirm} className='popup-confirm'>Confirmar</button>
            <button onClick={() => setShowConfirm(false)} className='popup-cancel'>Cancelar</button>
          </div>
        </div>
      </div>
      )}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-alumnos">
            <h1>Agregar alumno</h1>

            {error && <p className="alert-error">{error}</p>}

            <div className="popup-form">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />

              <input
                type="text"
                placeholder="DNI (opcional)"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>

            <div className="popup-buttons">
              <button
                className="cancel"
                onClick={() => {
                  setShowPopup(false);
                  setError('');
                }}
              >
                Cancelar
              </button>

              <button className="confirm">
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Table
