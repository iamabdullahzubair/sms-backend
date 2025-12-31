const PermissionRepo = require("../repositories/permission.repo");
const PrivilegeRepo = require("../repositories/privilege.repo");
const RoleRepo = require("../repositories/role.repo");
const RolePermissionRepository = require("../repositories/rolePermission.repo");

class AdminSettingService {
    constructor(tenant) {
        this.db = tenant;
        this.roleRepo = new RoleRepo(tenant);
        this.rolePermissionRepo = new RolePermissionRepository(tenant);
        this.prirvilegeRepo = new PrivilegeRepo(tenant);
        this.permissionRepo = new PermissionRepo(tenant);
    }

    async getAllRoles() {
        return await this.roleRepo.getAllRoles();
    }

    async createRole(body) {
        const { role, permissions } = body;
        if (!role || !permissions.length) {
            throw new ApiError("Role must have a name and at least one permission", 400);
        }

        const transaction = await this.db.sequelize.transaction();
        try {
            // Create role
            const createdRole = await this.roleRepo.createRole(role, { transaction });

            // Assign permissions
            await this.rolePermissionRepo.assignPermissions(
                createdRole.id,
                permissions,
                this.currentUser.id,
                transaction
            );

            // Commit transaction
            await transaction.commit();

            return { role: createdRole, message: "Role created successfully" };
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating role:", error);
            throw error;
        }
    }

    async createBulkRoles(rolesData) {
        const transaction = await this.db.sequelize.transaction();
        try {
            // Create bulk roles inside a transaction
            const createdRoles = await this.roleRepo.createBulkRole(rolesData, { transaction });

            // Commit transaction if all roles are successfully created
            await transaction.commit();

            return { roles: createdRoles, message: "Bulk roles created successfully" };
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating bulk roles:", error);
            throw error;
        }
    }

    // ✅ List All Permissions
    async getAllPermissions() {
        try {
            const privileges = await this.prirvilegeRepo.getAllPriviledges({ raw: true });
            const permissions = await this.permissionRepo.getAllPermissions({ raw: true });

            const data = privileges.map(priv => {
                return {
                    ...priv,
                    permissions: permissions.filter(per => per.privilege_id === priv.id)
                };
            });

            // Find permissions not assigned to any privilege
            const assignedPrivilegeIds = new Set(privileges.map(p => p.id));
            const orphanPermissions = permissions.filter(
                per => !assignedPrivilegeIds.has(per.privilege_id)
            );

            // Add "others" category if there are orphan permissions
            if (orphanPermissions.length > 0) {
                data.push({
                    id: 'others', // Special ID
                    name: 'Unassigned Permissions',
                    slug: 'unassigned',
                    description: 'Permissions not assigned to any privilege',
                    permissions: orphanPermissions,
                    type: 'orphan',
                    createdAt: null,
                    updatedAt: null
                });
            }
            return data
        } catch (error) {
            throw new Error("Error fetching all permissions: " + error.message);
        }
    }

    // ✅ Get Permission by Slug
    async getPrivilegeBySlug(slug) {
        try {
            return await this.prirvilegeRepo.getPriviledgeBySlug(slug);
        } catch (error) {
            throw new Error("Error fetching permission by slug: " + error.message);
        }
    }

    // ✅ Get Permission by Slug
    async getPermissionBySlug(slug) {
        try {
            return await this.permissionRepo.getPermissionBySlug(slug);
        } catch (error) {
            throw new Error("Error fetching permission by slug: " + error.message);
        }
    }

    // ✅ Create a Single Privilege With Permissions
    async createPrivilegeAndPermissions(data) {
        const transaction = await this.db.sequelize.transaction();
        try {
            // Destructure the input data
            const { permissions = [], ...privilegeData } = data;

            // 1. Pehle privilege create karein
            const privilege = await this.prirvilegeRepo.createPriviledge(privilegeData, { transaction });

            // 2. Phir bulk mein permissions create karein (agar permissions hain to)
            let createdPermissions = [];
            if (permissions.length > 0) {
                // Har permission mein privilege_id add karein
                const permissionsWithPrivilegeId = permissions.map(permission => ({
                    ...permission,
                    privilege_id: privilege.id
                }));

                // Bulk create karein
                createdPermissions = await this.permissionRepo.createBulkPermissions(permissionsWithPrivilegeId, { transaction });
            }

            await transaction.commit();

            return {
                success: true,
                message: 'created successfully'
            };

        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error creating privilege and permissions: ${error.message}`);
        }
    }

    // ✅ Create a Single Permission with Transaction
    async createPermission(data) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const permission = await this.permissionRepo.createPermission(data, { transaction });
            await transaction.commit();
            return permission;
        } catch (error) {
            await transaction.rollback();
            throw new Error("Error creating permission: " + error.message);
        }
    }

    // ✅ Bulk Create Permissions with Transaction
    async createBulkPermissions(dataArray) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const permissions = await this.permissionRepo.createBulkPermissions(dataArray, { transaction });
            await transaction.commit();
            return permissions;
        } catch (error) {
            await transaction.rollback();
            throw new Error("Error creating bulk permissions: " + error.message);
        }
    }

}

module.exports = AdminSettingService;
