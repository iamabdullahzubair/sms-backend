
class AuthRepo {
    constructor(db) {
        this.db = db;
        this.User = db.models.User;
    }

    async getUserByEmail(email, transaction = null) {
        return this.User.findOne({ where: { email }, transaction });
    }

    async updateRefreshToken(userId, refreshToken, transaction = null) {
        return this.User.update(
            { refresh_token: refreshToken },
            { where: { id: userId }, transaction }
        );
    }

    async updateLastLogin(userId, transaction = null) {
        return this.User.update(
            { last_login: new Date() },
            { where: { id: userId }, transaction }
        );
    }

    async incrementFailedLoginAttempts(userId, transaction = null) {
        await this.User.increment(
            { failed_login_attempts: 1 },
            { where: { id: userId }, transaction }
        );
        return this.User.update(
            { last_failed_login_attempt: new Date() },
            { where: { id: userId }, transaction }
        );
    }

    async resetFailedLoginAttempts(userId, transaction = null) {
        return this.User.update(
            { failed_login_attempts: 0 },
            { where: { id: userId }, transaction }
        );
    }

    async updateIsActive(userId, is_active, transaction = null) {
        try {
            return await this.User.update(
                { is_active },
                { where: { id: userId }, transaction }
            );
        } catch (error) {
            console.log('UserRepo :: error in updateIsActive', error);
            throw error
        }
    }

    async createUser(userData, transaction = null) {
        return this.User.create(userData, { transaction });
    }
    async getUserById(id, transaction = null) {
        return this.User.findByPk(id, { transaction });
    }
    async getFullUserDetails(userId, transaction = null) {
        const user = await this.User.findByPk(userId, { transaction });
        if (!user) return null;

        // Get user role (assume only one role per user)
        const roleResult = await this.db.sequelize.query(
            `
        SELECT roles.id, roles.name, roles.slug
        FROM user_roles
        JOIN roles ON roles.id = user_roles.role_id
        WHERE user_roles.user_id = :userId
        `,
            {
                replacements: { userId },
                type: this.db.Sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        const role = roleResult?.[0];
        if (!role) return { ...user, roleId: null, roleName: null, permissions: [], privileges: [] };

        // Get permissions
        const permissions = await this.db.sequelize.query(
            `
        SELECT permissions.slug
        FROM role_permissions
        JOIN permissions ON permissions.id = role_permissions.permission_id
        WHERE role_permissions.role_id = :roleId
        `,
            {
                replacements: { roleId: role.id },
                type: this.db.Sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        // Get privileges
        const privileges = await this.db.sequelize.query(
            `
        SELECT privileges.slug
        FROM role_privileges
        JOIN privileges ON privileges.id = role_privileges.privilege_id
        WHERE role_privileges.role_id = :roleId
        `,
            {
                replacements: { roleId: role.id },
                type: this.db.Sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        const permissionSlugs = permissions.length ? permissions.map(perm => perm?.slug) : []
        const privilegeSlugs = privileges.length ? privileges.map(privilege => privilege?.slug) : []

        const { password, refresh_token, ...safeUser } = user.toJSON();

        return {
            ...safeUser,
            roleId: role.id,
            roleName: role.name,
            roleSlug: role.slug,
            privileges: privilegeSlugs,
            permissions: permissionSlugs,
        };
    }
    async getUsersPermissionsAndPriviledge(roleId) {
        // Get permissions
        const permissions = await this.db.sequelize.query(
            `
        SELECT permissions.name, permissions.slug
        FROM role_permissions
        JOIN permissions ON permissions.id = role_permissions.permission_id
        WHERE role_permissions.role_id = :roleId
        `,
            {
                replacements: { roleId },
                type: this.db.Sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        // Get privileges
        const privileges = await this.db.sequelize.query(
            `
        SELECT privileges.name, privileges.slug
        FROM role_privileges
        JOIN privileges ON privileges.id = role_privileges.privilege_id
        WHERE role_privileges.role_id = :roleId
        `,
            {
                replacements: { roleId },
                type: this.db.Sequelize.QueryTypes.SELECT,
                transaction,
            }
        );

        return {
            permissions, privileges
        }
    }


}

module.exports = AuthRepo;
