import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logIn } from '../../backend/auth.api';

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState('');
  const [error, setError] = useState("");

  const preventSpaces = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const cleanSpaces = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, "").toLowerCase();
  };

  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_+=\{\}\[\]:;,.?\/\\|~`]+$/;

  function handlePasswordChange(e) {
    const value = e.target.value;
    if (value === "" || passwordRegex.test(value)) {
      setPassword(value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (!email || !password) {
      setError('Debes ingresar tu correo electrónico y contraseña para iniciar sesión.');
      return;
    }

    try {
      const data = await logIn(email, password);
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.usuario));

      setMsg(data.mensaje || 'Inicio de sesión exitoso.');
      navigate('/classes');

    } catch (err) {
      setError(
        err.response?.data?.Error ||
        err.response?.data?.error ||
        'No se pudo iniciar sesión. Intenta nuevamente.'
      );
    }
  };

  return (
    <main className="login-main">
      {error && (
        <div className='alert-error'>
          <h1><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9F9F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>¡Error!</h1>
          <p>{error}</p>
        </div>
      )}
      <form className="login-inner" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1>Inicia sesión en tu cuenta</h1>
          <p>Ingresa tu mail debajo para iniciar sesión en tu cuenta</p>
        </div>
        <div className="email-input">
          <label>Correo Electrónico</label>
          <input
            type="email"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={preventSpaces}
            onInput={cleanSpaces}
          />
        </div>
        <div className="password-input">
          <div className="password-label">
            <label>Contraseña</label>
            <Link>¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              maxLength={255}
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>
        <div className="login-buttons">
          <button type="submit">Iniciar sesión</button>
        </div>

        {/* Registro */}
        <div className="link-register">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/signup">¡Regístrate aquí!</Link>
          </p>
        </div>
      </form>
    </main>
  );
}

export default Login;
