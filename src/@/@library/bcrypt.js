const bcrypt = require('bcryptjs');

class Bcrypt {
    /**
     * @description Hash a password
     * @param {string} password - Plain text password
     * @returns {Promise<string>} - Hashed password
     */
    static async hashPassword(password) {
        const saltRounds = 10; // Recommended for strong security
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * @description Compare plain text password with hashed password
     * @param {string} password - Plain text password
     * @param {string} hashedPassword - Hashed password from database
     * @returns {Promise<boolean>} - True if matched, otherwise false
     */
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * @description Generate a random salt
     * @returns {Promise<string>} - Generated salt
     */
    static async generateSalt() {
        return await bcrypt.genSalt(10); // Generates a secure salt
    }

    /**
     * @description Hash data with custom salt
     * @param {string} data - Data to hash (e.g., password, token)
     * @param {string} salt - Custom salt value
     * @returns {Promise<string>} - Hashed data
     */
    static async hashWithSalt(data, salt) {
        return await bcrypt.hash(data, salt);
    }
}

module.exports = Bcrypt;
