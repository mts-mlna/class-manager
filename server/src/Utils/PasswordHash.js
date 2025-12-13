const Bcrypt = require('bcrypt');

const saltos = 10;

const EncriptarPassword = async (password) => {
    const salt = await Bcrypt.genSalt(saltos);
    return Bcrypt.hash(password, salt);
};

const CompararPassword = async (passwordIngresada, passwordHasheada) => {
    return Bcrypt.compare(passwordIngresada, passwordHasheada);
};

module.exports = { EncriptarPassword, CompararPassword };
