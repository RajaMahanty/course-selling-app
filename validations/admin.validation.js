const { z } = require("zod");

const adminSignupSchema = z.object({
    email: z
        .string()
        .email({ message: "Email not in proper format" })
        .nonempty({ message: "Email is required" })
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password cannot exceed 128 characters" })
        .nonempty({ message: "Password is required" })
        .trim()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            {
                message:
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
            }
        ),
    firstName: z
        .string()
        .regex(/^[a-zA-Z]{2,50}$/, {
            message: "First name must be 2-50 letters only",
        })
        .nonempty({ message: "First name is required" })
        .trim(),
    lastName: z
        .string()
        .regex(/^[a-zA-Z]{2,50}$/, {
            message: "Last name must be 2-50 letters only",
        })
        .nonempty({ message: "Last name is required" })
        .trim(),
});

const adminSigninSchema = z.object({
    email: z
        .string()
        .email({ message: "Email not in proper format" })
        .nonempty({ message: "Email is required" })
        .trim()
        .toLowerCase(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(128, { message: "Password cannot exceed 128 characters" })
        .nonempty({ message: "Password is required" })
        .trim()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            {
                message:
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
            }
        ),
});

const adminCreateCourse = z.object({
    title: z
        .string({ message: "Must be string!" })
        .nonempty({ message: "Title is required" })
        .trim()
        .min(5, { message: "Title must be at least 5 characters long" })
        .max(100, { message: "Title cannot exceed 100 characters" }),
    description: z
        .string()
        .nonempty({ message: "Description is required" })
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(500, { message: "Description cannot exceed 500 characters" }),
    price: z
        .number()
        .positive({ message: "Price must be a positive number" })
        .int({ message: "Price must be an integer" }),
    imageUrl: z
        .string()
        .trim()
        .url({ message: "ImageUrl must be a valid URL" })
        .optional(),
});

module.exports = { adminSignupSchema, adminSigninSchema, adminCreateCourse };
