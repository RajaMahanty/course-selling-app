const { z } = require("zod");

const coursePurchaseSchema = z.object({
    courseId: z
        .string({ message: "Must be string!" })
        .nonempty({ message: "CourseId is required" })
        .trim(),
});

module.exports = { coursePurchaseSchema };
