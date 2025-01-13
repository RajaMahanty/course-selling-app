const jwt = require("jsonwebtoken");

const generateToken = async (payload, type = "user") => {
    if (!payload) {
        throw new Error("Payload is required");
    }

    const secret =
        type === "admin"
            ? process.env.JWT_ADMIN_SECRET
            : process.env.JWT_USER_SECRET;

    if (!secret) {
        throw new Error(`JWT secret for ${type} not configured`);
    }

    try {
        return jwt.sign(payload, secret, {
            expiresIn: process.env.JWT_EXPIRES_USER || "168h",
            algorithm: "HS256",
        });
    } catch (error) {
        throw new Error(`Error generating token: ${error.message}`);
    }
};

module.exports = { generateToken };
