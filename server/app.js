const cookieParser = require("cookie-parser");

const Express = require('express');
const App = Express();
const Cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

App.use(cookieParser());

// CORS + credenciales para cookies
App.use(Cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Para JSON
App.use(Express.json());

// Rutas
const RutasLogin = require('./src/Router/Login.Router');
App.use('/api', RutasLogin);
App.use("/api/clases", require("./src/Router/Class.Router"));

App.listen(PORT,()=>{
console.log(`🚀 http://localhost:${PORT}`);
});
