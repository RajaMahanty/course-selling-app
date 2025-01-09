const { Router } = require("express");

const { adminModel } = require("../db");
const {
    adminSignupSchema,
    adminSigninSchema,
} = require("../validations/admin.validation");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
    try {
        // Validate input
        const result = adminSignupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        const { email, password, firstName, lastName } = result.data;

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin with this email already exists",
            });
        }

        // Create new admin
        const hashedPassword = await hashPassword(password);
        const admin = await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: admin._id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
            },
        });
    } catch (error) {
        console.error("Error in admin signup:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during signup",
        });
    }
});

adminRouter.post("/signin", async (req, res) => {
    try {
        // Validating input
        const result = adminSigninSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        const { email, password } = result.data;

        // Check if admin exists in the database
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate authentication token
        const token = await generateToken({ adminId: admin._id }, "admin");

        return res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .status(200)
            .json({
                success: true,
                message: "Successfully signed in",
                data: {
                    admin: {
                        id: admin._id,
                        email: admin.email,
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                    },
                },
            });
    } catch (error) {
        console.error("Error in admin signin:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during signin",
        });
    }
});

adminRouter.post("/create-course", async (req, res) => {
    return res.json({ message: "Create a course endpoint" });
});

adminRouter.put("/update-course", async (req, res) => {
    return res.json({ message: "Update a course endpoint" });
});

adminRouter.get("/all-courses", async (req, res) => {
    return res.json({
        message: "Get all the course created by admin endpoint",
    });
});

module.exports = { adminRouter };
