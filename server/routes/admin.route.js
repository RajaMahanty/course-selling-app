const { Router } = require("express");

const { adminModel, courseModel } = require("../db");
const {
    adminSignupSchema,
    adminSigninSchema,
    adminCreateCourse,
    adminUpdateCourse,
} = require("../validations/admin.validation");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const { adminAuthMiddleware } = require("../middlewares/auth");

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
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
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
        const admin = await adminModel.findOne({ email }).select("+password");
        /* 
            .select("+password") as i have done 
            password: {
                type: String,
                required: true,
                select: false, // will not include password in query results by default
            } in this attribute i have done select: false so it will not return password by default
            i have to write .select("+password") this with findOne({})s

        */
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
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

adminRouter.post("/create-course", adminAuthMiddleware, async (req, res) => {
    const adminId = req.adminId;
    if (!adminId) {
        return res.status(401).json({
            message: "AuthMiddleware problem, no adminId given in req!",
        });
    }

    const result = adminCreateCourse.safeParse(req.body);

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

    const { title, description, price, imageUrl } = result.data;

    try {
        const course = await courseModel.create({
            title,
            description,
            price,
            imageUrl,
            creatorId: adminId,
        });
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error in creating course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during course creation",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

adminRouter.put("/update-course", adminAuthMiddleware, async (req, res) => {
    const adminId = req.adminId;

    const result = adminUpdateCourse.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: result.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }

    // const { courseId, ...updateFields } = result.body;
    const { courseId, ...updateFields } = result.data;

    try {
        const course = await courseModel.updateOne(
            {
                _id: courseId,
                creatorId: adminId,
            },
            {
                $set: updateFields,
            }
        );
        if (course.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });
    } catch (error) {
        console.error("Error in updating course:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during course update",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

adminRouter.get("/all-courses", adminAuthMiddleware, async (req, res) => {
    // all the courses created by the admin
    const adminId = req.adminId;

    try {
        const courses = await courseModel.find({
            creatorId: adminId,
        });

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses,
        });
    } catch (error) {
        console.error("Error in fetching courses:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during course fetch",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

module.exports = { adminRouter };
