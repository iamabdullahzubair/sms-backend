const { tenantDbManager } = require("database");
const Bcrypt = require("@/@library/bcrypt");
const PermissionRepo = require("database/repositories/tenant/permission.repo");
const PrivilegeRepo = require("database/repositories/tenant/privilege.repo");
const RoleRepo = require("database/repositories/tenant/role.repo");
const RolePermissionRepository = require("database/repositories/tenant/rolePermission.repo");
const RolePriviledgeRepository = require("database/repositories/tenant/rolePriviledge.repo");
const UserRepo = require("database/repositories/tenant/user.repo");
const UserRoleRepo = require("database/repositories/tenant/userRole.repo");
const BranchRepo = require("database/repositories/tenant/branch.repo");

// Role, Privilege, and Permission metadata for the Owner user
const roleData = {
    name: "Owner",
    slug: "owner_role",
    description: "This role is only for Owner Who has whole access of portal"
};

const priviledgeData = {
    name: "Owner",
    slug: "owner_priviledge",
    description: "This priviledge is only for Owner Who has whole access of portal"
};

const permissionData = {
    name: "Owner",
    slug: "owner_permission",
    description: "This permission is only for Owner Who has whole access of portal"
};

const generateBranchCode = (tenantName) => {
    const cleanedName = tenantName.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const initials = cleanedName.slice(0, 3);
    // const timestamp = Date.now().toString().slice(-4);
    return `${initials}-01`;
};

const fillOwnerDataInNewTenant = async (data) => {
    // If tenant DB is not registered, return early
    if (!tenantDbManager.has(data.dbName)) {
        return;
    }

    // Get tenant-specific DB instance
    let dbInstance = tenantDbManager.get(data.dbName);
    const transaction = await dbInstance.sequelize.transaction();

    try {
        // Initialize repositories for tenant
        const userRepo = new UserRepo(dbInstance);
        const roleRepo = new RoleRepo(dbInstance);
        const priviledgeRepo = new PrivilegeRepo(dbInstance);
        const permissionRepo = new PermissionRepo(dbInstance);
        const userRoleRepo = new UserRoleRepo(dbInstance);
        const rolePriviledgeRepo = new RolePriviledgeRepository(dbInstance);
        const rolePermissionRepo = new RolePermissionRepository(dbInstance);
        const branchRepo = new BranchRepo(dbInstance)

        // Hash owner password
        const hashedPassword = await Bcrypt.hashPassword(data.password);

        // Create the owner user
        const userData = {
            name: data.owner_name,
            email: data.email,
            phone_number: data.phone_number,
            password: hashedPassword
        };
        const user = await userRepo.createUser(userData, transaction);

        // Create role, privilege, and permission entries
        const role = await roleRepo.createRole(roleData, { transaction });
        const priviledge = await priviledgeRepo.createPriviledge(priviledgeData, { transaction });
        const permission = await permissionRepo.createPermission(permissionData, { transaction });

        // Assign privilege and permission to role
        await rolePriviledgeRepo.assignPriviledges(role.id, [priviledge.id], data.email, transaction);
        await rolePermissionRepo.assignPermissions(role.id, [permission.id], data.email, transaction);

        // Assign role to user
        await userRoleRepo.assignRoleToUserWithTrack(user.id, role.id, data?.email, { transaction });

        const branchData = {
            branch_code: data.branch_code ?? generateBranchCode(data.tenant_name),
            branch_name: data.tenant_name,
            branch_email : data.school_email,
            board_type: data.board_type,
            affiliation_Number : data.affiliation_Number ?? 'N/A',
            contact_number: data.phone_number,
            address: data.full_address,
            city: data.city,
            state: data.state,
            pin_code: data.pincode,
            is_head_branch: true,
            timezone: data.timezone || 'Asia/Kolkata'
        }

        await branchRepo.addBranch(branchData, transaction)
        // Commit transaction after all operations succeed
        await transaction.commit();

        // Return success response
        return {
            success: true
        };
    } catch (error) {
        // Rollback on error to maintain data integrity
        await transaction.rollback();
        console.log("fillOwnerDataInNewTenant :: Error while creating owner role, privilege, permission, or user =>", error);
        throw error;
    }
};

module.exports = {
    fillOwnerDataInNewTenant
}