import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../../backend/auth.api';

function Signup() {

  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const preventSpaces = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const cleanSpaces = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, "").toLowerCase();
  };

  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_+=\{\}\[\]:;,.?\/\\|~`]+$/;
  const minLengthRegex = /.{8,}/;
  const uppercaseRegex = /[A-Z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()\-_+=\{\}\[\]:;,.?\/\\|~`]/;

  function handlePasswordChange(e) {
    const value = e.target.value;

    if (value === "" || passwordRegex.test(value)) {
      setPassword(value);
    }
  }

  function validatePassword(password) {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe tener al menos una letra mayúscula.';
    }

    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe tener al menos un número.';
    }

    if (!/[!@#$%^&*()\-_+=\{\}\[\]:;,.?\/\\|~`]/.test(password)) {
      return 'La contraseña debe tener al menos un carácter especial.';
    }

    return '';
  }

  const handleClosePopup = () => {
    setShowPopup(false); // oculta el popup
    navigate('/login'); // redirige al login
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setError('')
    setPasswordError('')

    const passwordValidationError = validatePassword(password);

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (password !== password2) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    setPasswordError('');

    try {
      const data = await signUp(email, password);
      setMsg(data.mensaje);
      setShowPopup(true)
    } catch (err) {
      setError('Error al registrar usuario');
    }
  }
  return (
    <main className='register-main'>
      {error && (
        <div className='alert-error'>
          <h1><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9F9F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>¡Error!</h1>
          <p>{error}</p>
        </div>
      )}
      {passwordError && (
        <div className='alert-error'>
          <h1><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9F9F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>¡Error!</h1>
          <p>{passwordError}</p>
        </div>
      )}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h1>Cuenta creada</h1>
            <p>{msg}</p>
            <button onClick={handleClosePopup}>
              OK
            </button>
          </div>
        </div>
      )}
      <form className="register-container" onSubmit={handleSubmit}>
        <div className="register-help">
          <h1>Crea una cuenta nueva</h1>
          <div>
            <p>Bienvenido al formulario de creacion de cuentas. Unos consejos antes de crear una cuenta nueva son:</p>
            <ul>
              <li>Ingresa un correo electrónico válido.</li>
              <li>Para crear una contraseña segura, debe tener como mínimo 8 caracteres, 1 número y 1 caracter especial.</li>
              <li>Una vez toques el botón de crear, se te enviará un correo electrónico para confirmar la creación de tu cuenta.  </li>
              <li>Una vez se haya confirmado tu cuenta, ya puedes <Link to="/login">iniciar sesión</Link> normalmente.</li>
            </ul>
          </div>
        </div>
        <div className="register-inner">
          <div className='email-input'>
            <label htmlFor="">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={preventSpaces} onInput={cleanSpaces} placeholder='nombre@empresa.com' required />
          </div>
          <div className='password-input'>
            <label htmlFor="">Contraseña</label>
            <div className='password-field register-password-field'>
              <input type={showPassword ? "text" : "password"} placeholder='••••••••' value={password} onChange={handlePasswordChange} />
              <button className='register-show-password' type='button' onClick={() => setShowPassword(!showPassword)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
            </div>
          </div>
          <div className='password-input'>
            <label htmlFor="">Confirmar contraseña</label>
            <div className='password-field register-password-field'>
              <input type={showPassword ? "text" : "password"} placeholder='••••••••' value={password2} onChange={(e) => setPassword2(e.target.value)} />
              <button className='register-show-password' type='button' onClick={() => setShowPassword(!showPassword)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
            </div>
          </div>
          <div className='login-buttons'>
            <button type='submit' onSubmit={handleSubmit}>Registrarme</button>
          </div>
          <div className='link-register'>
            <p>¿Ya tienes cuenta? <Link to="/login">¡Inicia sesión!</Link></p>
          </div>
        </div>
      </form>
    </main>
  )
}

export default Signup
