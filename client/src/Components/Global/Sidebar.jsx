import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import guest from '../../assets/guest.jpg';
import '../Layouts.css';

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <>
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className='close-btn' onClick={onClose}>
                    ✖
                </button>

                <nav className='sidebar-content'>
                    <ul>
                                <li><Link to="/classes" onClick={onClose}>Mis cursos</Link></li>
                                <li><Link to="/login" onClick={onClose}>Iniciar sesión</Link></li>
                                <li><Link to="/signup" onClick={onClose}>Crear cuenta</Link></li>
                    </ul>

                    <ul>
                        {/* PERFIL */}
                        <li className='profile'>
                            <span>
                                <img src={guest} alt="" />
                                <div>
                                            <h1>Invitado</h1>
                                            <p>Sin sesión</p>
                                </div>
                            </span>
                        </li>
                            <li className='action-buttons'>
                                <button className='logout'>
                                    Cerrar sesión
                                </button>
                            </li>
                    </ul>
                </nav>
            </aside>

            {isOpen && <div className='overlay' onClick={onClose}></div>}
        </>
    );
};

export default Sidebar;
