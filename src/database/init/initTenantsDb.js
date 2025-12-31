const path = require("path");
const { Sequelize } = require("sequelize");

const { tenantSequelize } = require("./connections");
const { adminDb } = require("./initMasterDb");
const { initModels } = require("../utils/initModels");
const { addAllowedOrigin } = require("@/@configs/corsConfig");

/**
 * @typedef {Object} TenantDB
 * @property {import("sequelize").Sequelize} sequelize - The Sequelize instance for the tenant DB.
 * @property {Object.<string, typeof import("sequelize").Model>} models - The initialized models.
 * @property {typeof Sequelize} Sequelize - The Sequelize class reference.
 */

/** 
 * A map to store tenant database connections.
 * @type {Map<string, TenantDB>}
 */
const tenantDbManager = new Map();

/**
 * Creates a new database if it doesn't exist.
 * @param {string} dbName - The database name to create.
 * @returns {Promise<void>}
 */
const createDatabaseIfNotExists = async (dbName) => {
    try {
        // Check if database exists (MS SQL Server version)
        const [results] = await adminDb.sequelize.query(
            `SELECT name FROM sys.databases WHERE name = :dbName`,
            {
                replacements: { dbName },
                type: adminDb.Sequelize.QueryTypes.SELECT
            }
        );

        if (!results) {
            console.log(`🔄 Database ${dbName} does not exist, creating...`);
            await adminDb.sequelize.query(`CREATE DATABASE [${dbName}]`);
            console.log(`✅ Database ${dbName} created successfully`);
        }
    } catch (error) {
        console.error(`❌ Failed to create database ${dbName}:`, error);
        throw new Error(`Database creation failed for ${dbName}`);
    }
};

/**
 * Adds a tenant database connection.
 * @param {string} dbName - The tenant database name.
 * @param {object} [tenant] - (Optional) The tenant record to avoid redundant DB queries.
 * @returns {Promise<TenantDB>} The connected tenant database instance.
 * @throws {Error} If the tenant is not found.
 */
const addTenantDB = async (dbName, tenant = null) => {
    if (tenantDbManager.has(dbName)) {
        console.log(`ℹ️ TenantDB ${dbName} already cached.`);
        return tenantDbManager.get(dbName);
    }

    console.log(`Attempting to connect TenantDB: ${dbName}`);

    // If tenant data is not provided, fetch it from the database
    if (!tenant) {
        tenant = await adminDb.models.Tenant.findOne({ where: { dbName, status: 'active' } });
        if (!tenant) throw new Error(`Tenant ${dbName} not found`);
    }

    // Ensure database exists before connecting
    await createDatabaseIfNotExists(dbName);

    const sequelize = tenantSequelize(tenant.dbName);
    const models = initModels(sequelize, path.join(__dirname, "../models/tenants"));
    addAllowedOrigin(tenant.subdomain);

    /** @type {TenantDB} */
    const tenantDBInstance = { sequelize, models, Sequelize };

    tenantDbManager.set(dbName, tenantDBInstance);

    await sequelize.sync({ force: true }); // ✅ Ensure models are properly synced

    console.log(`✅ Successfully connected & cached TenantDB: ${dbName}`);

    return tenantDBInstance;
};

/**
 * Preloads all tenant databases into memory.
 * @returns {Promise<void>}
 */
const preloadAllTenants = async () => {
    console.log("Preloading all tenants...");

    // Fetch all tenants at once
    const tenants = await adminDb.models.Tenant.findAll({ where: { status: 'active' } });

    // Use the fetched tenants to avoid duplicate queries
    await Promise.all(tenants.map(async (tenant) => await addTenantDB(tenant.dbName, tenant)));

    console.log(`Preloaded ${tenants.length} tenants`);
};

module.exports = {
    addTenantDB,
    preloadAllTenants,
    tenantDbManager,
    createDatabaseIfNotExists
};