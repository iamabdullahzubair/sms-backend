const { ZodError } = require("zod");

/**
 * Universal Zod Validator Utility
 *
 * @param {ZodSchema} schema - Zod schema
 * @param {any} data - Data to validate
 * @returns {any} Validated data or throws ZodError
 */
const validateWithSchema = async (schema, data) => {
    try {
        const result = await schema.parseAsync(data);
        return result; // ✅ Validated & cleaned data
    } catch (error) {
        if (error instanceof ZodError) {
            // simple format
            throw {
                success: false,
                message: "Validation failed",
                errors: error.errors.map(e => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            };
        }
        throw error;
    }
};

module.exports = { validateWithSchema };
