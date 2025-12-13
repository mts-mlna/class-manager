const jwt = require("jsonwebtoken");

/**
 * Middleware opcional.
 * Si hay token → agrega req.user
 * Si NO hay token → req.user = null
 * No bloquea la ruta.
 */
function verificarToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
}

/**
 * Middleware OBLIGATORIO.
 * Solo deja pasar si hay un token válido.
 */
function verificarTokenRequerido(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ mensaje: "No autorizado: falta token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ mensaje: "No autorizado: token inválido" });
    }
}

module.exports = {
    verificarToken,
    verificarTokenRequerido,
};
