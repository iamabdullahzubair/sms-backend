const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class UserRole extends Model {}

    UserRole.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },
        role_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "roles",
                key: "id"
            }
        },
        assigned_by: {
            type: DataTypes.STRING, // 🔹 Tracks admin who assigned the role
        },
        assigned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, 
        }
    }, 
    {
        sequelize,
        modelName: "UserRole",
        tableName: "user_roles",
        timestamps: true
    });

    return UserRole;
};
