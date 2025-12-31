const { z } = require("zod");

const userSchema = z.object({
    id: z.string().uuid().optional(), // UUID
    school_id: z.string().uuid("Invalid school ID").optional(),
    name: z.string().min(3, "Name must be at least 3 characters long").max(255),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    is_active: z.boolean().optional(),
    last_login: z.date().optional(),
    profile_picture: z.string().url("Invalid profile picture URL").optional(),
    access_token: z.string().optional(),
});

module.exports = { userSchema };
