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

module.exports = { adminSignupSchema, adminSigninSchema };
