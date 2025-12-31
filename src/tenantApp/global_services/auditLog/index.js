const { AuditLogRepo } = require("../../../database/repositories/tenant/auditLog.repo");

class AuditLogService {
    constructor(tenantDb, requestObj) {
        this.repo = new AuditLogRepo(tenantDb);
        this.requestObj = requestObj;
    }

    async getAllAudits() {
        try {
            return this.repo.findAll(this.requestObj.body)
        } catch (error) {
            throw error
        }
    }

    /* ---------- Helper: Extract IP & User Agent ---------- */
    getRequestMeta() {
        return {
            ip: this.requestObj?.ip || null,
            userAgent: this.requestObj?.headers["user-agent"] || null,
            branchId: this.requestObj?.branch_id || null,
            userId: this.requestObj?.user?.id || null,
        };
    }

    /* ---------- Helper: Compare Data ---------- */
    diff(oldVal, newVal) {
        if (!oldVal || !newVal) return { old: oldVal, new: newVal };

        const changed = {};
        Object.keys(newVal).forEach((key) => {
            if (oldVal[key] !== newVal[key]) {
                changed[key] = {
                    old: oldVal[key],
                    new: newVal[key],
                };
            }
        });

        return {
            old: Object.keys(changed).length ? oldVal : null,
            new: Object.keys(changed).length ? newVal : null,
        };
    }
}

/* ============================================================
    CREATE LOG
=============================================================== */
AuditLogService.prototype.logCreate = async function ({
    module,
    recordId,
    newValue,
    transaction,
}) {
    const { ip, userAgent, branchId, userId } = this.getRequestMeta();

    return this.repo.create(
        {
            user_id: userId,
            branch_id: branchId,
            module,
            action: "CREATE",
            record_id: recordId,
            old_value: null,
            new_value: newValue,
            ip_address: ip,
            user_agent: userAgent,
        },
        transaction
    );
};


/* ============================================================
    LOGIN LOG
=============================================================== */
AuditLogService.prototype.logLogin = async function () {
    const { ip, userAgent, branchId, userId } = this.getRequestMeta();

    return this.repo.create({
        user_id: userId,
        branch_id: branchId,
        module: "AUTH",
        action: "LOGIN",
        ip_address: ip,
        user_agent: userAgent,
    });
};

/* ============================================================
    LOGOUT LOG
=============================================================== */
AuditLogService.prototype.logLogout = async function () {
    const { ip, userAgent, branchId, userId } = this.getRequestMeta();

    return this.repo.create({
        user_id: userId,
        branch_id: branchId,
        module: "AUTH",
        action: "LOGOUT",
        ip_address: ip,
        user_agent: userAgent,
    });
};

module.exports = { AuditLogService };
