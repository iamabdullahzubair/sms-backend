const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class RolePrivilege extends Model { }

    RolePrivilege.init({
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
        privilege_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "privileges", key: "id" },
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
        modelName: "RolePrivilege",
        tableName: "role_privileges",
        timestamps: true
    });

    return RolePrivilege;
};
