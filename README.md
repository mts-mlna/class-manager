# Class Manager

## 📘 Descripción
Class Manager es una aplicación web diseñada para facilitar el proceso de toma de asistencia en las escuelas. Pensada para profesores y preceptores, permite gestionar la asistencia de forma rápida, organizada y accesible desde cualquier dispositivo.

## 🛠️ Tecnologías utilizadas
- **Backend:** Node.js
- **Frontend:** ReactJS

## 📚 Librerías utilizadas
### Backend
- **Express:** Para crear el servidor y manejar rutas de manera eficiente.
- **Router (Express Router):** Para organizar y estructurar las rutas del backend.
- **Nodemon:** Para la ejecución del backend.
- **CORS:** Permite que el frontend solicite datos del backend.
- **Nodemailer:** Para realizar el envío de correos.
- **bcrypt:** Para hashear contraseñas.
- **JSONWebToken (JWT):** Para la autenticación del usuario.
- **Concurrently:** Permite ejecutar varios comandos o scripts de npm de forma simultánea.
- **npm run all:** Permite ejecutar múltiples scripts de npm de manera secuencial.
- **sqlite3:** Base de datos utilizada en este proyecto.

### Frontend
- ReactJS (Core)

## 🚀 Instalación y ejecución
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/class-manager.git

# Instalar dependencias necesarias
npm install

# Como el proyecto cuenta con concurrently, ejecutar el siguiente script en la carpeta padre:
npm run dev

# Luego de unos instantes, se abrirá en el navegador automáticamente el localhost del frontend
localhost:5173
```

## 📄 Licencia
Este proyecto está bajo la licencia MIT. Puedes usarlo libremente siempre que se incluya el aviso de copyright correspondiente.

