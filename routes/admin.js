const { Router } = require("express");

const adminRouter = Router();

userRouter.post("/signup", async (req, res) => {
    return res.json({ message: "Admin signup endpoint" });
});

userRouter.post("/signin", async (req, res) => {
    return res.json({ message: "Admin signin endpoint" });
});

userRouter.post("/create-course", async (req, res) => {
    return res.json({ message: "Create a course endpoint" });
});

userRouter.put("/update-course", async (req, res) => {
    return res.json({ message: "Create a course endpoint" });
});

userRouter.get("/all-courses", async (req, res) => {
    return res.json({ message: "Create a course endpoint" });
});

module.exports = { adminRouter };
