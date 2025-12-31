const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class RolePermission extends Model { }

    RolePermission.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "roles", key: "id" },
        },
        permission_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "permissions", key: "id" },
        },
        granted_by: {
            type: DataTypes.STRING // 🔹 Tracks who granted the permission
        },
        granted_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "RolePermission",
        tableName: "role_permissions",
        timestamps: true
    });

    return RolePermission;
};
