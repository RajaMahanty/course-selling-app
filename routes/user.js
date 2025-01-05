const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
    return res.json({ message: "Signup endpoint" });
});

userRouter.post("/signin", async (req, res) => {
    return res.json({ message: "Signin endpoint" });
});

userRouter.get("/purchases", async (req, res) => {
    return res.json({ message: "User's courses purchased endpoint" });
});

module.exports = { userRouter };
