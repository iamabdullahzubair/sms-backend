const { tenantDbManager } = require("../database/initTenantsDb");

/**
 * @typedef {Object} TenantDB
 * @property {import("sequelize").Sequelize} sequelize - The Sequelize instance for the tenant DB.
 * @property {Object.<string, typeof import("sequelize").Model>} models - The initialized models.
 * @property {typeof import("sequelize")} Sequelize - The Sequelize library.
 */

/**
 * Express middleware to attach the tenant database instance to the request object.
 * @param {import("express").Request & { tenant?: TenantDB }} req - The Express request object with the tenant property.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The next middleware function.
 */
const tenantMiddleware = (req, res, next) => {
  const tenantDbName = req.headers["x-tenant-db"];

  if (!tenantDbName) {
    return res.status(400).json({ message: "Tenant header missing" });
  }

  const tenant = tenantDbManager.get(tenantDbName);

  if (!tenant) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  req.tenant = tenant; // ✅ Tenant attached to req object
  next();
};

module.exports = tenantMiddleware;
