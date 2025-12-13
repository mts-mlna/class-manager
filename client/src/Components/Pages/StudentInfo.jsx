import React, { useState } from 'react'

function StudentInfo() {

    const [isEditable, setIsEditable] = useState(false)

    const toggleEdit = () => {
        setIsEditable(prev => !prev)
    }

  return (
    <main className='student-info-main'>
      <section className='student-info-inner'>
        <div>
            <h1>Datos del estudiante</h1>
        </div>
        <div>
            <label htmlFor="">Nombre(s)</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Apellido(s)</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">DNI (sin puntos)</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Fecha de nacimiento</label>
            <input type="date" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Nacionalidad</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Domicilio</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Número de teléfono o celular</label>
            <input type="tel" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Correo electrónico o E-Mail</label>
            <input type="email" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Género</label>
            <select name="" id="" disabled={!isEditable}>
                <option value=""></option>
                <option value="">M (Masculino)</option>
                <option value="">F (Femenino)</option>
                <option value="">X (No binario)</option>
            </select>
        </div>
        <div className='retire-auth'>
            <label htmlFor="">Autorización para retirarse del establecimiento</label>
            <input type="checkbox" name="" id="" disabled={!isEditable} />
        </div>
      </section>
      <section className='parent-info-inner'>
        <div>
            <h1>Datos del madre/padre/tutor</h1>
        </div>
        <div>
            <label htmlFor="">Nombre(s)</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Apellido(s)</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">DNI (sin puntos)</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">CUIL</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Número de teléfono o celular</label>
            <input type="tel" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Correo electrónico o E-Mail</label>
            <input type="email" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Domicilio</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Vínculo con el estudiante</label>
            <input type="text" name="" id="" disabled={!isEditable} />
        </div>
        <div className='retire-auth'>
            <label htmlFor="">Autorización para retirarlo del establecimiento</label>
            <input type="checkbox" name="" id="" disabled={!isEditable} />
        </div>
        <div>
            <label htmlFor="">Contactos de emergencia</label>
            <textarea name="" id="" disabled={!isEditable}></textarea>
        </div>
      </section>
      <section className='si-action-inner'>
        <button className='si-save'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg></button>
        <button className='si-allow-edit' onClick={toggleEdit}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></button>
        <button className='si-delete'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
      </section>
    </main>
  )
}

export default StudentInfo
