import React from 'react'
import Logo from '../../assets/logo.png'
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'
import { useState } from 'react';

const Header = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  return(
    <header>
        <nav className='navigation'>
            <ul>
                <li>
                    <Link to="/" className='logo'>
                        <img src={Logo} alt=""/>
                        <span>Class Manager</span>
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <p>Inicio</p>
                        <div className='underline'></div>
                    </Link>
                </li>
                <li>
                    <a href="">
                        <p>Contacto</p>
                        <div className='underline'></div>
                    </a>
                </li>
                <li>
                    <a href="">
                        <p>Información</p>
                        <div className='underline'></div>
                    </a>
                </li>
            </ul>
            <ul>
                <li>
                    <button className='open-sidebar' onClick={() => setSidebarOpen(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                </li>
            </ul>
        </nav>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
      </header>
  )
}

export default Header