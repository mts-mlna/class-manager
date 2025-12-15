import React from 'react'
import { useState, useEffect } from 'react';
import CustomSelect from '../Items/CustomSelect';

function CreateClass() {

  const [courseOValue, setCourseOValue] = useState("");
  const [courseAValue, setCourseAValue] = useState("");
  const [labSelectValue, setLabSelectValue] = useState("");
  const [nombreMateria, setNombreMateria] = useState("");

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



  return (
    <main className='create-class-main'>
      <form className='create-class-inner'>
        <div><h1>Crear una clase nueva</h1></div>
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
          <button type='submit'>Crear clase</button>
        </div>
      </form>
    </main>
  )
}

export default CreateClass
