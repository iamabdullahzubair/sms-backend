const express = require('express');
const TenantController = require('masterApp/02controllers/tenant.controller');

const tenantManagerRouter = express.Router();

tenantManagerRouter.get('/tenants', TenantController.getAllTenants);
tenantManagerRouter.post('/tenants/register', TenantController.createTenant);

tenantManagerRouter.get('/tenants/:tenantId', TenantController.getTenantDetails);
tenantManagerRouter.get('/tenants/subdomain/:subdomain', TenantController.getTenantDetailsBySubdomain);
tenantManagerRouter.get('/tenants/db/:dbName', TenantController.getTenantInfoByName);

tenantManagerRouter.put('/tenants/:tenantId', TenantController.updateTenant);
tenantManagerRouter.delete('/tenants/:tenantId', TenantController.deleteTenant);

tenantManagerRouter.patch('/tenants/:tenantId/activate', TenantController.activateTenant);
tenantManagerRouter.patch('/tenants/:tenantId/deactivate', TenantController.deactivateTenant);

module.exports = tenantManagerRouter;
