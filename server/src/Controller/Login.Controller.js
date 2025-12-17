const db = require('../DataBase/db')
const { genEmailToken, genLoginToken } = require('../Utils/Token')
const { sendVerification } = require('../Utils/Email')
const encryption = require('bcryptjs')

const SignUp = (req, res) => {
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({Error: 'Faltan datos obligatorios para completar el registro'})
        }

        const username = email.split('@')[0]

        const querycheck = `SELECT * FROM Usuarios WHERE email = ?`
        db.get(querycheck, [email], async (err, user) => {
            if (err) {
                console.error('Error durante la verificación.', err)
                return res.status(404).json({Error: 'Ocurrió un problema al verificar tu información. Asegúrate que tus datos sean correctos o intenta de nuevo más tarde.'})
            }
            if (user) {
                return res.status(409).json({Error: 'Este correo electrónico ya le pertenece a otra cuenta. Si es tuyo, intenta iniciar sesión o recuperar tu contraseña. De lo contrario, utiliza otro correo electrónico.'});
            }

            const hash = encryption.hashSync(password, 10)
            const token = genEmailToken(email)
            const query = `
                INSERT INTO Usuarios (username, email, password, tokenEmail)
                VALUES (?, ?, ?, ?)
            `;

            db.run(query, [username, email, hash, token], async (err) => {
                if (err) {
                    console.error('Error durante algo.', err)
                    return res.status(500).json({ error: 'No se pudo crear la cuenta en este momento. Te recomendamos intentar nuevamente más tarde.', detalle: err.message })
                }
                await sendVerification(email, token)
                return res.status(201).json({
                    mensaje: 'Se te ha enviado un email para confirmar tu cuenta. Una vez lo hayas hecho, podrás iniciar sesión sin problemas.'
                })
            })
        })

    } catch(err) {
        console.error('ERROR EN SIGNUP:', err);
        return res.status(500).json({
            error: 'Ocurrió un problema inesperado en el servidor. Por favor, intenta nuevamente en unos minutos. Si el problema persiste, contacta a un administrador.',
            detalle: err.message
        });
    }
}

const LogIn = (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Verificar datos
    if (!email || !password) {
      return res.status(400).json({
        Error: 'Debes ingresar tu correo electrónico y contraseña para iniciar sesión.'
      });
    }

    // 2️⃣ Buscar usuario por email
    const query = 'SELECT * FROM Usuarios WHERE email = ?';

    db.get(query, [email], async (err, user) => {
      if (err) {
        console.error('Error al buscar el usuario:', err);
        return res.status(500).json({
          Error: 'Ocurrió un problema al intentar iniciar sesión. Intenta nuevamente más tarde.'
        });
      }

      // 3️⃣ Usuario no existe
      if (!user) {
        return res.status(401).json({
          Error: 'El correo electrónico o la contraseña son incorrectos.'
        });
      }

      // 4️⃣ Cuenta no verificada
      if (!user.verificado) {
        return res.status(403).json({
          Error: 'Tu cuenta aún no fue verificada. Revisa tu correo electrónico y confirma tu cuenta.'
        });
      }

      // 5️⃣ Comparar contraseñas
      const passwordMatch = await encryption.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          Error: 'El correo electrónico o la contraseña son incorrectos.'
        });
      }

      const token = genLoginToken(user)

      // 6️⃣ Login exitoso
      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso.',
        token,
        usuario: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });

  } catch (err) {
    console.error('ERROR EN LOGIN:', err);
    return res.status(500).json({
      Error: 'Ocurrió un problema inesperado en el servidor. Intenta nuevamente más tarde.'
    });
  }
};

module.exports = { SignUp, LogIn }