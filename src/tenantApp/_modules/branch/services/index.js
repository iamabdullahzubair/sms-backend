const { AuditLogService } = require("tenantApp/global_services/auditLog");

class BranchService {

    constructor(req) {
        this.db = req.tenant;
        this.sequelize = this.db.sequelize;

        this.req = req; // user, branch, ip, etc.

        this.auditLog = new AuditLogService(this.db, req);
    }

}


module.exports = BranchService;