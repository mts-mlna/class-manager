const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendVerification(email, token) {
    const enlace = `http://localhost:3000/api/verify/${token}`;

    await transporter.sendMail({
        from: `"Class Manager" <${process.env.EMAIL}>`,
        to: email,
        subject: "Último paso: Verifica tu cuenta ahora",
        html: `
            <div style="margin: 0; padding: 0; background-image: linear-gradient(90deg, #80808033 1px, #0000 0), linear-gradient(#80808033 1px, #0000 0); background-size: 40px 40px; background-color: #FFE0E0; border: 2px solid #111; padding: 50px; align-items: center; gap: 25px;">
                <div style="margin: 5% auto; width: fit-content;">
                    <h1 style="margin: 0; padding: 20px 160px; font-size: 20px; background: #FFF; border: 2px solid #111; border-radius: 5px; text-transform: uppercase;">Confirma tu cuenta</h1>
                </div>
                <div style="width: 100%; gap: 25px; line-height: 30px;">
                    <p style="margin: 0; padding: 0; font-size: 20px; text-align: center; margin-bottom: 5%;">¡Tu cuenta está casi lista!<br/>Sólo necesitamos que verifiques tu correo electrónico para asegurarnos que te pertenece.<br/>Haz clic abajo para terminar la verificación:</p>
                    <div style="width: fit-content; margin: auto; margin-top: 10px;">
                        <a href="${enlace}" style="background: #FF4D50; padding: 20px; color: #000; text-decoration: none; border: 2px solid #111; border-radius: 5px; font-weight: bold; font-size: 20px;">Verificar Cuenta</a>
                    </div>
                </div>
                <div style="width: fit-content; margin: 3% auto;">
                    <p>Si no creaste esta cuenta, ignora el correo.</p>
                </div>
            </div>
        `
    });
}

module.exports = { sendVerification };
