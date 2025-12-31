const { initMasterDb, adminDb } = require("./init/initMasterDb");
const { addTenantDB, preloadAllTenants, tenantDbManager } = require("./init/initTenantsDb");

module.exports = {
    adminDb,
    initMasterDb,
    addTenantDB,
    preloadAllTenants,
    tenantDbManager,
};
