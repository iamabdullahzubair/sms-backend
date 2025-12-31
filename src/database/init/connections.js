const { Sequelize } = require("sequelize");
const { loggerdb } = require("../utils/logger");
const { dbConfig } = require("../../@/@configs");

const masterSequelize = new Sequelize({
    ...dbConfig.master,
    logging: (query, timing) => loggerdb(query, timing, dbConfig.master.database),
    benchmark: true
});

const tenantSequelize = (dbName) => {
    return new Sequelize({
        ...dbConfig.tenant,
        database: dbName,
        logging: (query, timing) => loggerdb(query, timing, dbName),
        benchmark: true, // Required for timing
    });
};

module.exports = {
    masterSequelize,
    tenantSequelize
}