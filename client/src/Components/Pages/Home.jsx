import React from 'react'

function Home() {
  return (
    <main className='main-home'>
        <section className='main-hero'>
            <div className='hero-text-intro'>
                <h1>Una manera revolucionaria de <span>tomar asistencias.</span></h1>
                <p>En muchas escuelas, las asistencias y la administración de los alumnos siguen haciéndose en formato papel, y los sitios de las escuelas se usan exclusivamente para que los alumnos puedan acceder al material de dicha escuela. <b>Class Manager</b> llegó para cambiar eso.<br/>Esta plataforma permite digitalizar y simplificar las tareas más importantes de la vida escolar. Toma asistencias de manera rápida y precisa, generar planillas con un solo clic, y accedé a un conjunto de herramientas pensadas para directivos, profesores y otros staff de la escuela.</p>
                <a>Quiero saber más<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg></a>
            </div>
        </section>
    </main>
  )
}

export default Home
