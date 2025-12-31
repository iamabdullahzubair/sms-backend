const { z } = require("zod");

const tenantSchema = z.object({
    owner_name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(255, "Name cannot exceed 255 characters"),
    tenant_name: z
        .string()
        .min(3, "School Name must be at least 3 characters long")
        .max(255, "Name cannot exceed 255 characters"),

    dbName: z
        .string()
        .min(3, "Database name must be at least 3 characters long")
        .max(20, "Database name cannot exceed 20 characters"),

    subdomain: z
        .string()
        .max(100, "Subdomain cannot exceed 100 characters"),

    phone_number: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 to 15 digits"),

    email: z.email("Invalid email format"),

    website: z.string()
        .transform(val => val === "" ? undefined : val)
        .optional()
        .refine(val => !val || /^https?:\/\/.+\..+/.test(val), {
            message: "Invalid website URL",
        }),

    logo_url: z.url("Invalid logo URL").optional(),

    status: z
        .enum(["active", "inactive", "suspended"], {
            message: "Status must be either 'active', 'inactive', or 'suspended'",
        })
        .optional(),

    city: z
        .string()
        .min(3, "City must be at least 3 characters long")
        .max(255, "City cannot exceed 255 characters"),

    state: z
        .string()
        .min(3, "State must be at least 3 characters long")
        .max(255, "State cannot exceed 255 characters"),

    pincode: z
        .string()
        .regex(/^\d{5,8}$/, "Pincode must be between 5 to 8 digits"),

    full_address: z
        .string()
        .max(500, "Full address cannot exceed 500 characters")
        .optional(),
});

module.exports = { tenantSchema };
