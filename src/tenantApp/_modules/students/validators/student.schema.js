const { z } = require("zod");

const createStudentSchema = z.object({
    name: z.string().min(2),
    gender: z.enum(["male", "female", "other"]),
    dob: z.string().refine(v => !Number.isNaN(Date.parse(v)), { message: "Invalid date" }),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    blood_group: z.string().max(10).optional(),
    emergency_contact: z.string().optional(),
    photo_url: z.string().url().optional(),
});

const createAdmissionSchema = z.object({
    admission_number: z.string().min(1),
    admission_date: z.string().refine(v => !Number.isNaN(Date.parse(v))),
    branch_id: z.string().uuid(),
    previous_school: z.string().optional(),
    documents: z.any().optional(),
});

const enrollStudentSchema = z.object({
    academic_year_id: z.string().uuid(),
    class_section_id: z.string().uuid(),
    branch_id: z.string().uuid(),
    roll_number: z.number().optional(), // if omitted, backend will auto-generate
    enrollment_number: z.string().optional(),
    enrollment_date: z.string().optional(),
});

module.exports = {
    createStudentSchema,
    createAdmissionSchema,
    enrollStudentSchema
};
