import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Evitar espacios
  const preventSpaces = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const cleanSpaces = (e) => {
    e.target.value = e.target.value.replace(/\s+/g, "").toLowerCase();
  };

  // Validación de contraseña
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_+=\{\}\[\]:;,.?\/\\|~`]+$/;

  function handlePasswordChange(e) {
    const value = e.target.value;
    if (value === "" || passwordRegex.test(value)) {
      setPassword(value);
    }
  }

  // 🔹 LOGIN USANDO AUTHCONTEXT
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await login(email, password);

    if (res.error || res.message) {
      setError(res.error || res.message);
      return;
    }

    navigate("/classes");
  }

  return (
    <main className="login-main">
      <form className="login-inner" onSubmit={handleSubmit}>
        <div className="login-header">
          <h1>Inicia sesión en tu cuenta</h1>
          <p>Ingresa tu mail debajo para iniciar sesión en tu cuenta</p>
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Error */}
        {error && (
          <p className="error-msg" style={{ color: "red", marginTop: "5px" }}>
            {error}
          </p>
        )}

        {/* Botones */}
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
