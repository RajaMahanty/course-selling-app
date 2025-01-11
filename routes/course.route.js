const { Router } = require("express");

const { userAuthMiddleware } = require("../middlewares/auth");
const { coursePurchaseSchema } = require("../validations/course.validation");
const { purchasedModel, courseModel } = require("../db");

const courseRouter = Router();

courseRouter.post("/purchase", userAuthMiddleware, async (req, res) => {
    try {
        // Validating input
        const result = coursePurchaseSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                errors: result.error.errors.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }

        const { courseId } = result.data;
        const userId = req.userId; // Getting userId from auth middleware

        // Check if the user already has the course
        const existingPurchase = await purchasedModel.findOne({
            courseId,
            userId,
        });

        if (existingPurchase) {
            return res.status(409).json({
                success: false,
                message: "You have already purchased this course",
            });
        }

        // Create new purchase
        const purchase = await purchasedModel.create({
            userId,
            courseId,
            purchaseDate: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: "Course purchased successfully",
            data: purchase,
        });
    } catch (error) {
        console.error("Course purchase error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process course purchase",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

courseRouter.get("/preview", async (req, res) => {
    try {
        const courses = await courseModel.find({});

        if (!courses.length) {
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
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching courses",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
});

module.exports = { courseRouter };
