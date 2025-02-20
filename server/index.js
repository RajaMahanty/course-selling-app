const express = require("express");
const cookieParser = require("cookie-parser");

const { userRouter } = require("./routes/user.route");
const { courseRouter } = require("./routes/course.route");
const { adminRouter } = require("./routes/admin.route");
const { connect } = require("./db");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    try {
        console.log("Trying to connect");
        await connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port: ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

main();
