const { Router } = require("express");

const { hashPassword, comparePassword } = require("../utils/hash");
const {
    userSignupSchema,
    userSigninSchema,
} = require("../validations/user.validation");
const { generateToken } = require("../utils/jwt");
const { userModel, purchasedModel } = require("../db");
const { userAuthMiddleware } = require("../middlewares/auth");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    try {
        // Validate input
        const result = userSignupSchema.safeParse(req.body);
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

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists",
            });
        }

        // Create new user
        const hashedPassword = await hashPassword(password);
        const user = await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.error("Error in user signup:", error);
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

userRouter.post("/signin", async (req, res) => {
    try {
        // Validating input
        const result = userSigninSchema.safeParse(req.body);
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

        // Check if user exists in the database
        const user = await userModel.findOne({ email }).select("+password");
        /* 
            .select("+password") as i have done 
            password: {
                type: String,
                required: true,
                select: false, // will not include password in query results by default
            } in this attribute i have done select: false so it will not return password by default
            i have to write .select("+password") this with findOne({})s

        */

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate authentication token
        const token = await generateToken({ userId: user._id });

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
                    user: {
                        id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    },
                },
            });
    } catch (error) {
        console.error("Error in user signin:", error);
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

userRouter.get("/purchases", userAuthMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        // Populate course details and select specific fields
        const purchases = await purchasedModel
            .find({ userId })
            .populate("courseId", "title description price imageLink")
            .lean()
            .exec();

        // Format the response data
        const formattedPurchases = purchases.map((purchase) => ({
            id: purchase._id,
            purchaseDate: purchase.purchaseDate,
            course: purchase.courseId,
            status: purchase.status || "completed",
        }));

        return res.status(200).json({
            success: true,
            message: purchases.length
                ? "Purchases retrieved successfully"
                : "No purchases found",
            count: purchases.length,
            data: formattedPurchases,
        });
    } catch (error) {
        console.error("Error fetching user purchases:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch purchases",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
});

module.exports = { userRouter };
