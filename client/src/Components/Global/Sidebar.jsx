import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import guest from '../../assets/guest.jpg';
import '../Layouts.css';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(() => navigate("/login"));
    };

    return (
        <>
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className='close-btn' onClick={onClose}>
                    ✖
                </button>

                <nav className='sidebar-content'>
                    <ul>

                        {/* SIEMPRE visibles para usuarios logueados */}
                        {user && (
                            <>
                                <li><Link to="/classes" onClick={onClose}>Mis cursos</Link></li>
                            </>
                        )}

                        {/* SI NO ESTÁ LOGUEADO → mostrar links públicos */}
                        {!user && (
                            <>
                                <li><Link to="/login" onClick={onClose}>Iniciar sesión</Link></li>
                                <li><Link to="/signup" onClick={onClose}>Crear cuenta</Link></li>
                            </>
                        )}
                    </ul>

                    <ul>
                        {/* PERFIL */}
                        <li className='profile'>
                            <p>
                                <img src={user ? user.avatar || guest : guest} alt="" />
                                <div>
                                    {user ? (
                                        <>
                                            <h1>{user.nombre}</h1>
                                            <p>{user.correo}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h1>Invitado</h1>
                                            <p>Sin sesión</p>
                                        </>
                                    )}
                                </div>
                            </p>
                        </li>

                        {/* BOTÓN CERRAR SESIÓN (solo si logueado) */}
                        {user && (
                            <li className='action-buttons'>
                                <button className='logout' onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </aside>

            {isOpen && <div className='overlay' onClick={onClose}></div>}
        </>
    );
};

export default Sidebar;
