const { Model, DataTypes } = require("sequelize");

module.exports =  (sequelize) => {
    class Tenant extends Model {}

    Tenant.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            owner_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            tenant_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            dbName: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            subdomain: {
                type: DataTypes.STRING(255),
                unique: true,
            },
            phone_number: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.STRING(50),
                defaultValue: "active",
                validate: {
                    isIn: [["active", "inactive", "suspended"]],
                },
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            pincode: {
                type: DataTypes.STRING(25),
                allowNull: false,
            },
            full_address: {
                type: DataTypes.STRING(255),
            },
        },
        {
            sequelize,
            modelName: "Tenant",
            tableName: "tenants",
            timestamps: true,
        }
    );

    return Tenant;
};
