import React from 'react'
import { useState, useEffect } from 'react';
import CustomSelect from '../Items/CustomSelect';
import { createClass, updateClass, getClassById } from '../../backend/auth.api';
import { useNavigate, useParams } from 'react-router-dom'

function CreateClass() {

  const [courseOValue, setCourseOValue] = useState("");
  const [courseAValue, setCourseAValue] = useState("");
  const [labSelectValue, setLabSelectValue] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // --- R E S T R I C C I O N E S  ---
  const restricciones = {
    "1": ["1", "2", "3", "4", "6"],
    "2": ["1", "2", "3", "4", "6"],
    "3": ["1", "2", "3", "4", "6"],
    "4": ["1", "2", "3", "4"],
    "5": ["1", "2", "3", "4"],
    "6": ["1", "3"],
    "7": ["1", "2"],
  };

  const opcionesA = ["1", "2", "3", "4", "6"];
  const opcionesFiltradasA = courseOValue ? restricciones[courseOValue] : opcionesA;

  const opcionesAFormatoSelect = [
    { value: "", label: "-" },
    ...opcionesFiltradasA.map(op => ({
      value: op,
      label: op
    }))
  ];

  if (courseAValue && courseOValue && !opcionesFiltradasA.includes(courseAValue)) {
    setCourseAValue("");
  }

  const [labInputValue, setLabInputValue] = useState("");
  const [labValue, setLabValue] = useState("");

  const labRules = {
    "1-1": ["2", "4"],
    "1-2": ["1", "3"],
    "1-3": ["6", "8"],
    "1-4": ["5", "7"],
    "1-6": ["9", "11"],

    "2-1": ["2", "4"],
    "2-2": ["1", "3"],
    "2-3": ["6", "8"],
    "2-4": ["5", "7"],
    "2-6": ["9", "11"],

    "3-1": ["2", "4"],
    "3-2": ["1", "3"],
    "3-3": ["6", "8"],
    "3-4": ["5", "7"],
    "3-6": ["9", "11"],

    "4-1": ["2", "8"],
    "4-2": ["1", "3"],
    "4-3": ["4", "6"],
    "4-4": ["5", "7"],

    "5-1": ["4", "8"],
    "5-2": ["1", "3"],
    "5-3": ["2", "6"],
    "5-4": ["5", "7"],

    "6-1": ["2", "6"],
    "6-3": ["4", "8"],

    "7-1": ["1", "3"],
    "7-2": ["2", "4"],
  };

  const labKey = `${courseOValue}-${courseAValue}`;
  const labOptions = labRules[labKey] || [];

  useEffect(() => {
    if (labValue && !labOptions.includes(labValue)) {
      setLabValue("");
    }
  }, [courseOValue, courseAValue]);

  const [noAplica, setNoAplica] = useState(false);

  const handleNoAplicaChange = () => {
    setNoAplica(prev => {
      const newValue = !prev;

      if (newValue) {
        setLabInputValue("");
        setLabValue("");
      }

      return newValue;
    });
  };

  useEffect(() => {
    if (!noAplica) {
      setLabInputValue(courseOValue);
    }
  }, [courseOValue, noAplica]);

  useEffect(() => {
    if (noAplica) {
      setLabSelectValue("");
    }
  }, [noAplica]);

  const courseOptions = [
    { value: "", label: "-" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" }
  ];

  const labSelectOptions = [
    { value: "", label: "-" },
    ...labOptions.map(op => ({
      value: op,
      label: op
    }))
  ];

  const nivelOptions = ["-", "Primero", "Segundo"].map(opt => ({
    value: opt === "-" ? "" : opt,
    label: opt
  }));

  const [nivelValue, setNivelValue] = useState("");

  const cursoFinal = courseAValue
    ? `${courseOValue}°${courseAValue}`
    : `${courseOValue}`;

  const grupoTaller = noAplica ? null : `${labInputValue}${labValue}`;

const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');
  setMsg('');

  if (!nombreMateria || !courseOValue || !courseAValue || !nivelValue) {
    setError('Debes completar todos los campos obligatorios.');
    return;
  }

  const curso = `${courseOValue}º${courseAValue}ª`;
  const taller = noAplica ? null : `${courseOValue}.${labValue}`;

  const token = localStorage.getItem('token');

  try {
    if (isEdit) {
      await updateClass(
        id,
        {
          nombre: nombreMateria,
          curso,
          taller,
          cuatrimestre: nivelValue
        },
        token
      );
      setMsg('Clase actualizada correctamente.');
    } else {
      await createClass(
        {
          nombre: nombreMateria,
          curso,
          taller,
          cuatrimestre: nivelValue
        },
        token
      );
      setMsg('Clase creada correctamente.');
    }

    navigate('/classes');

  } catch (err) {
    setError('Error al guardar la clase.');
  }
};

useEffect(() => {
  if (!isEdit) return;

  const fetchClass = async () => {
    try {
      const token = localStorage.getItem('token');
      const { clase } = await getClassById(id, token);

      setNombreMateria(clase.nombre);

      // curso "7º2ª"
      const [o, a] = clase.curso.split(/[ºª]/).filter(Boolean);
      setCourseOValue(o);
      setCourseAValue(a);

      // taller "7.4" o null
      if (clase.taller) {
        const [, lab] = clase.taller.split('.');
        setLabValue(lab);
        setNoAplica(false);
      } else {
        setNoAplica(true);
      }

      setNivelValue(clase.cuatrimestre);

    } catch (err) {
      setError('No se pudo cargar la clase.');
    }
  };

  fetchClass();
}, [id]);



  return (
    <main className='create-class-main'>
      {error && <p className="alert-error">{error}</p>}
      {msg && <p className="alert-success">{msg}</p>}
      <form className='create-class-inner' onSubmit={handleSubmit}>
        <div><h1>{isEdit ? 'Editar clase' : 'Crear una clase nueva'}</h1></div>
        <div className='class-name'>
          <label htmlFor="">Nombre de la materia</label>
          <input type="text" value={nombreMateria} onChange={(e) => setNombreMateria(e.target.value)}/>
        </div>
        <div className='class-course'>
          <label htmlFor="">Curso</label>
          <div className="center">
            <div className='o'>
              <CustomSelect
                options={courseOptions}
                value={courseOValue}
                onChange={(opt) => setCourseOValue(String(opt.value))}
                placeholder="-"
              />
              <p>o</p>
            </div>
            <div className='a'>
              <CustomSelect
                options={opcionesAFormatoSelect}
                value={courseAValue}
                placeholder="-"
                onChange={(opt) => setCourseAValue(opt.value)}
              />
              <p>a</p>
            </div>
          </div>
        </div>
        <div className='lab-group'>
          <label htmlFor="">Grupo de taller</label>
          <div className='lab-number'>
            <div className='mujajaja'>
              <input type="text" value={labInputValue} disabled/>
            </div>
              <CustomSelect
                options={labSelectOptions}
                value={labValue}
                placeholder="-"
                disabled={noAplica}
                onChange={(opt) => setLabValue(opt.value)}
              />
          </div>
          <div className='lab-checkbox'>
            <input type="checkbox" checked={noAplica} onChange={handleNoAplicaChange} />
            <label htmlFor="">No aplica</label>
          </div>
        </div>
        <div className='quadrimester'>
          <label htmlFor="">Cuatrimestre:</label>
          <CustomSelect
            options={nivelOptions}
            value={nivelValue}
            onChange={(opt) => setNivelValue(String(opt.value))}
            placeholder="-"
          />
        </div>
        <div className='class-button'>
          <button type='submit'>{isEdit ? 'Guardar cambios' : 'Crear clase'}</button>
        </div>
      </form>
    </main>
  )
}

export default CreateClass
