const express = require("express");

const app = express();

app.use(express.json());

app.post("/user/signup", async (req, res) => {
    return res.json({ message: "Signup endpoint" });
});

app.post("/user/signin", async (req, res) => {
    return res.json({ message: "Signin endpoint" });
});

app.get("/user/purchases", async (req, res) => {
    return res.json({ message: "Users purchased endpoint" });
});

app.post("/user/purchase", async (req, res) => {
    return res.json({ message: "Course purchasing endpoint endpoint" });
});

app.get("/user/my-courses", async (req, res) => {
    return res.json({ message: "Users all purchased courses endpoint" });
});

app.post("/courses", async (req, res) => {
    return res.json({ message: "All courses endpoint" });
});

app.listen(3000);
