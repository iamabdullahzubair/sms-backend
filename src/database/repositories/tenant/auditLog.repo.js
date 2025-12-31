class AuditLogRepo {
    constructor(tenantDb) {
        this.AuditLog = tenantDb.models.AuditLog;
    }

    async create(payload, transaction = null) {
        return this.AuditLog.create(payload, { transaction });
    }

    async getById(id) {
        return this.AuditLog.findByPk(id);
    }

    async findAll(filters = {}) {
        return this.AuditLog.findAll({ where: filters });
    }
}

module.exports = { AuditLogRepo };
