import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getClasses, deleteClass, updateClass } from '../../backend/auth.api';

function Classes() {

    const [classes, setClasses] = useState([]);
    const [error, setError] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);

    const toggleSelectClass = (classId) => {
        setSelectedClasses((prev) =>
            prev.includes(classId)
            ? prev.filter(id => id !== classId)
            : [...prev, classId]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedClasses.length === 0) return;

        try {
            const token = localStorage.getItem('token');

            for (const classId of selectedClasses) {
            await deleteClass(classId, token);
            }

            // Quitar del estado las clases eliminadas
            setClasses(prev =>
            prev.filter(clase => !selectedClasses.includes(clase.id))
            );

            setSelectedClasses([]);
        } catch (err) {
            setError('No se pudieron eliminar las clases seleccionadas.');
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await getClasses(token);
            setClasses(data.clases);
        } catch (err) {
            setError('No se pudieron cargar las clases.');
        }
        };

        fetchClasses();
    }, []);

  return (
    <main className='my-classes'>
        <div className='my-classes-inner'>
            <section className='my-classes-header'>
                <h1>Mis Cursos</h1>
                <div className='my-classes-inner-action'>
                    <div className='my-classes-search'>
                        <input type="text" name="" id="" placeholder='Filtrar clase por nombre, curso o grupo de taller...' />
                        <button><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
                    </div>
                    <div className='my-classes-buttons'>
                        <button className='delete-selected-class' onClick={handleDeleteSelected} disabled={selectedClasses.length === 0}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>Eliminar selección</button>
                        <Link to="/classes/new" className='new-class'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>Nueva clase</Link>
                    </div>
                </div>
            </section>
            <section className='my-classes-grid'>
                {classes.map(clase => (
                <div className='class' key={clase.id}>
                    <div className='class-card-header'>
                        <div className='checkbox-wrapper'>
                            <input type="checkbox" checked={selectedClasses.includes(clase.id)} onChange={() => toggleSelectClass(clase.id)} />
                            <span className='custom-checkbox'></span>
                        </div>
                        <Link to={`/class/${clase.id}`}><h1>{clase.nombre}</h1></Link>
                    </div>
                    <div>
                        <p>Curso: <b>{clase.curso}</b></p>
                        <p>Grupo: <b>{clase.taller ?? '-'}</b></p>
                        <p>Cuatrimestre: <b>{clase.cuatrimestre}</b></p>
                    </div>
                    <div className='class-edit'>
                        <Link to={`/classes/edit/${clase.id}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>Editar</Link>
                    </div>
                </div>
                ))}
            </section>
        </div>
    </main>
  )
}

export default Classes
