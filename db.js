const mongoose = require("mongoose");
const { Schema, model, connect } = mongoose;
require("dotenv").config();

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // will not include password in query results by default
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
});

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // will not include password in query results by default
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
});

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        trim: true,
        default: "https://placeholder.com/course-image.jpg",
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const purchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
});

userSchema.set("timestamps", true);
adminSchema.set("timestamps", true);
courseSchema.set("timestamps", true);
purchaseSchema.set("timestamps", true);

const userModel = model("User", userSchema);
const adminModel = model("Admin", adminSchema);
const courseModel = model("Course", courseSchema);
const purchasedModel = model("Purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchasedModel,
    connect,
};
