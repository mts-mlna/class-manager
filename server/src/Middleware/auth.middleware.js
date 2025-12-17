const { verifyLoginToken } = require('../Utils/Token');

const authMiddleware = (req, res, next) => {
console.log('Authorization header:', req.headers.authorization);
  const authHeader = req.headers.authorization;

  // 1️⃣ Verificar que exista el header
  if (!authHeader) {
    return res.status(401).json({
      Error: 'No estás autorizado. Debes iniciar sesión.'
    });
  }

  // 2️⃣ Verificar formato "Bearer TOKEN"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      Error: 'Formato de token inválido.'
    });
  }

  const token = parts[1];

  try {
    // 3️⃣ Verificar token
    const decoded = verifyLoginToken(token);

    // 4️⃣ Guardar usuario
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error('Error en auth middleware:', err);
    return res.status(401).json({
      Error: 'Sesión inválida o expirada. Vuelve a iniciar sesión.'
    });
  }
};

module.exports = authMiddleware;
