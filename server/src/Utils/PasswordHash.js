const Bcrypt = require('bcrypt');

const saltos = 10;

const encrypt = async (password) => {
    const salt = await Bcrypt.genSalt(saltos);
    return Bcrypt.hash(password, salt);
};

module.exports = { encrypt };