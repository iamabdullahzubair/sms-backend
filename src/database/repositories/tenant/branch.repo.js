const { Op } = require("sequelize");

class BranchRepo {
    constructor(tenantDb) {
        this.db = tenantDb;
        this.Branch = this.db.models.Branch;
    }

    async addBranch(branchData, transaction = null) {
        return await this.Branch.create(branchData, { transaction });
    }

    async updateBranch(id, data, transaction = null) {
        const branch = await this.Branch.findByPk(id, { transaction });
        if (!branch) throw new Error("Branch not found");

        await branch.update(data, { transaction });
        return branch;
    }

    async getBranchById(id, transaction = null) {
        return await this.Branch.findByPk(id, { transaction });
    }

    async getBranchByCode(branchCode, transaction = null) {
        return await this.Branch.findOne({
            where: { branch_code: branchCode },
            transaction
        });
    }

    async getAllBranches(
        { limit = 10, offset = 0, search = "", filters = {} } = {},
        transaction = null
    ) {
        const whereClause = { ...filters };

        if (search) {
            whereClause[Op.or] = [
                { branch_name: { [Op.like]: `%${search}%` } },
                { branch_code: { [Op.like]: `%${search}%` } },
                { board_type: { [Op.like]: `%${search}%` } },
                { landmark: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } },
                { city: { [Op.like]: `%${search}%` } },
                { state: { [Op.like]: `%${search}%` } },
                { country: { [Op.like]: `%${search}%` } },
            ];
        }

        const result = await this.Branch.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            transaction,
            order: [["branch_name", "DESC"]],
        });

        return {
            data: result.rows,
            totalCount: result.count,
        };
    }

    async deleteBranch(id, transaction = null) {
        const branch = await this.Branch.findByPk(id, { transaction });
        if (!branch) throw new Error("Branch not found");

        await branch.destroy({ transaction });
        return true;
    }

    async restoreBranch(id, transaction = null) {
        const branch = await this.Branch.findByPk(id, {
            paranoid: false,
            transaction
        });
        if (!branch) throw new Error("Branch not found");

        await branch.restore({ transaction });
        return branch;
    }

    async isBranchCodeExists(branchCode, excludeId = null, transaction = null) {
        const where = { branch_code: branchCode };

        if (excludeId) {
            where.id = { [this.db.Sequelize.Op.ne]: excludeId };
        }

        const count = await this.Branch.count({ where, transaction });
        return count > 0;
    }
}

module.exports = BranchRepo;
