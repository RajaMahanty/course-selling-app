const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    if (!password) {
        throw new Error("Password is required");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error(`Error hashing password: ${error.message}`);
    }
};

const comparePassword = async (password, hashedPassword) => {
    if (!password || !hashedPassword) {
        throw new Error("Password and hashed password are required");
    }

    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error(`Error comparing passwords: ${error.message}`);
    }
};

module.exports = { hashPassword, comparePassword };
