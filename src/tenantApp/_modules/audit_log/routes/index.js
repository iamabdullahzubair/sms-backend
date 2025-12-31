const { Router } = require("express");
const AuditLogController = require("../controllers");


const auditLogRouter = Router()

auditLogRouter.post("/get-all-audit-logs", AuditLogController.getAllAuditLogs)


module.exports = { auditLogRouter }
