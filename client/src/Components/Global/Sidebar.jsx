import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import guest from '../../assets/guest.jpg';
import '../Layouts.css';
import md5 from 'blueimp-md5';

const Sidebar = ({ isOpen, onClose }) => {

    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(localStorage.getItem('user')) : null;
    const isLogged = Boolean(token && user);

    const profileImage = isLogged
    ? `https://www.gravatar.com/avatar/${md5(user.email)}?d=identicon`
    : guest ;

    return (
        <>
            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                <button className='close-btn' onClick={onClose}>
                    ✖
                </button>

                <nav className='sidebar-content'>
                    <ul>
                        {isLogged && (
                            <li><Link to="/classes" onClick={onClose}>Mis cursos</Link></li>
                        )}
                        {!isLogged && (
                            <>
                                <li><Link to="/login" onClick={onClose}>Iniciar sesión</Link></li>
                                <li><Link to="/signup" onClick={onClose}>Crear cuenta</Link></li>
                            </>
                        )}
                    </ul>

                    <ul>
                        <li className='profile'>
                            <span>
                                <img src={isLogged ? `https://www.gravatar.com/avatar/${md5(user.email)}?d=identicon` : guest } alt="" />
                                <div>
                                    <h1>{isLogged ? user.username : 'Invitado'}</h1>
                                    <p>{isLogged ? user.email : 'Sin sesión'}</p>
                                </div>
                            </span>
                        </li>
                        {isLogged && (
                        <li className='action-buttons'>
                            <button className='logout' onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login' }}>Cerrar sesión</button>
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
