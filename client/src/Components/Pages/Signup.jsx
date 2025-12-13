import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {

  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();

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

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  async function handleSignup(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== password2) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Correo: email,
          Contraseña: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || "Error registrando usuario");
        return;
      }

      // Registro exitoso
      setSuccess("Registro completado.");

      // Limpia los campos
      setEmail("");
      setPassword("");
      setPassword2("");

      // ⏳ Espera 1 segundo para mostrar el mensaje (opcional)
      setTimeout(() => {
        navigate("/");   // 🔥 Redirección al inicio
      }, 800);

    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  }

  return (
    <main className='register-main'>
      <form className="register-container" onSubmit={handleSignup}>
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={preventSpaces} onInput={cleanSpaces} placeholder='nombre@empresa.com' />
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
            <button type='submit'>Registrarme</button>
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
