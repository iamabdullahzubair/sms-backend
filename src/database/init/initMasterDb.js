const { Sequelize } = require("sequelize");
// const Logging = require("@/@library/logging");
const { masterSequelize } = require("./connections");
const { initModels } = require("../utils/initModels");
const path = require("path");
const Tenant = require("../models/master/Tenant");
const Logging = require("@/@library/logging");

/**
 * @typedef {Object} AdminDb
 * @property {import("sequelize").Sequelize} sequelize - The Sequelize instance for the master DB.
 * @property {typeof import("sequelize")} Sequelize - The Sequelize library itself.
 * @property {Object.<string, typeof import("sequelize").Model>} models - The initialized models.
 */

/** @type {AdminDb} */
const adminDb = {};

const initMasterDb = async () => {
  try {
    await masterSequelize.authenticate();
    Logging.info("✅ Database connected successfully.");

    const models = initModels(masterSequelize, path.join(__dirname, "../models/master"));
    // const models = Tenant(masterSequelize)

    adminDb.sequelize = masterSequelize;
    adminDb.Sequelize = Sequelize;
    adminDb.models = models;

    await adminDb.sequelize.sync();
    // await adminDb.sequelize.sync({force:true});

  } catch (error) {
    console.error("❌ Database connection error:", error);
    Logging.error("❌ Database connection error:", error);
  }
};

module.exports = { initMasterDb, adminDb };
