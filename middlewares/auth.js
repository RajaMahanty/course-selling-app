const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");

const userAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided, authorization denied",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token, authorization denied",
        });
    }
};

const adminAuthMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided, authorization denied",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token, authorization denied",
        });
    }
};

module.exports = { userAuthMiddleware, adminAuthMiddleware };
