const { Router } = require("express");

const courseRouter = Router();

courseRouter.post("/purchase", async (req, res) => {
    return res.json({
        message: "Purchase course endpoint",
    });
});

courseRouter.get("/preview", async (req, res) => {
    return res.json({
        message: "Preview all courses endpoint",
    });
});

module.exports = { courseRouter };
