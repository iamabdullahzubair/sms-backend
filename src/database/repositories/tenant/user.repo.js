const { Op, QueryTypes } = require("sequelize");

class UserRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.User = this.db.models.User;
    }

    // --------------------------------------------------------
    // Create User
    // --------------------------------------------------------
    createUser(userData, transaction = null) {
        return this.User.create(userData, { transaction });
    }

    // --------------------------------------------------------
    // Get All Users (Raw Query)
    // --------------------------------------------------------
    async getAllUsers({ search, page = 1, limit = 10, sortBy = "created_at", sortOrder = "DESC", isActive }) {

        const offset = (page - 1) * limit;

        let whereClause = "WHERE 1=1";
        const replacements = { offset, limit, sortBy, sortOrder };

        if (search) {
            whereClause += " AND (name LIKE :search OR email LIKE :search)";
            replacements.search = `%${search}%`;
        }

        if (isActive !== undefined) {
            whereClause += " AND is_active = :isActive";
            replacements.isActive = isActive;
        }

        const query = `
            WITH Users_CTE AS (
                SELECT 
                    users.id,
                    users.name,
                    users.email,
                    users.is_active,
                    users.last_login,
                    users.profile_picture,
                    users.created_at,
                    users.updated_at,
                    roles.name AS role_name,
                    COUNT(*) OVER () AS total_count
                FROM users
                LEFT JOIN user_roles as ur ON ur.user_id = users.id
                LEFT JOIN roles ON ur.role_id = roles.id
                ${whereClause}
            )
            SELECT * 
            FROM Users_CTE 
            ORDER BY ${sortBy} ${sortOrder}
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;
        `;

        const users = await this.db.sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT,
        });

        const totalUsers = users.length > 0 ? users[0].total_count : 0;

        return {
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            users,
        };
    }

    // --------------------------------------------------------
    // Get by ID
    // --------------------------------------------------------
    getUserById(userId, transaction = null) {
        return this.User.findByPk(userId, { transaction });
    }

    // --------------------------------------------------------
    // Get by Email
    // --------------------------------------------------------
    getUserByEmail(email, transaction = null) {
        return this.User.findOne({ where: { email }, transaction });
    }
}

module.exports = UserRepo;
