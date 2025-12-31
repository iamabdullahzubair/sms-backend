module.exports = {
    constants: {
        isDevelopment: 'isDevelopment'
    },
    dbConfig : {
        master: {
            dialect: "mssql",
            host: "localhost",
            username: "sa",
            password: "root",
            database: "my_admin",
            logging: console.log,
            define: {
                timestamps: true,
                freezeTableName: true,
            },
            dialectOptions: {
                encrypt: false,
                options: {
                    requestTimeout: 30000,
                    enableArithAbort: true,
                },
            },
            pool: {
                max: 10,
                min: 1,
                acquire: 30000,
                idle: 10000,
            },
        },
        tenant: {
            dialect: "mssql",
            host: "localhost",
            username: "sa",
            password: "root",
            logging: console.log,
            define: {
                timestamps: true,
                underscored: true,
                freezeTableName: true,
            },
            dialectOptions: {
                encrypt: false,
                options: {
                    requestTimeout: 30000,
                    enableArithAbort: true,
                },
            },
            pool: {
                max: 10,
                min: 1,
                acquire: 30000,
                idle: 10000,
            },
        },
    }
}