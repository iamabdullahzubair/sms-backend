const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Role extends Model {}

    Role.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "branches", key: "id" },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // 🔹 Useful for assigning roles directly
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // 🔹 Useful for identifying default roles
        }
    }, 
    {
        sequelize,
        modelName: "Role",
        tableName: "roles",
        timestamps: true
    });

    return Role;
};
