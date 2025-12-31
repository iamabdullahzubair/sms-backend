const asyncHandler = require("@/@library/asyncHandler");
const { AuditLogService } = require("../../../03services/auditLog");

class AuditLogController {
    static getAllAuditLogs = asyncHandler(async (req, res) => {
        const service = new AuditLogService(req.tenant, req);
        const payload = await service.getAllAudits();

        res
            .status(200)
            .json(new ApiResponse(200, payload, "Fetched audits successfully"));
    });
}

module.exports = AuditLogController;
