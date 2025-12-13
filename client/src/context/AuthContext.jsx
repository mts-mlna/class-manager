import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Crear el contexto
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Al montar el componente → verificar si el usuario tiene cookie válida
    useEffect(() => {
        const verificarSesion = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/auth/me", {
                    credentials: "include",
                });

                const data = await res.json();

                if (data.user) {
                    setUser(data.user); // Guarda el usuario
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verificarSesion();
    }, []);

    // 🔹 Login → Guarda el usuario y la cookie viene automáticamente
    const login = async (email, password) => {
        const res = await fetch("http://localhost:3000/api/iniciar-sesion", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                Correo: email,
                Contraseña: password
             })
        });

        const data = await res.json();

        if (res.ok) {
            setUser(data.usuario);
        }

        return data;
    };

    // 🔹 Logout → Borra cookie y usuario en frontend
    const logout = async (onLogout) => {
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        setUser(null);

        // Si me pasaron un callback, lo ejecuto (por ejemplo navigate)
        if (onLogout) onLogout();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
