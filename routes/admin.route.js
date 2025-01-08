const { Router } = require("express");
const { adminModel } = require("../db");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
    return res.json({ message: "Admin signup endpoint" });
});

adminRouter.post("/signin", async (req, res) => {
    return res.json({ message: "Admin signin endpoint" });
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
