const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class AuditLog extends Model { }

    AuditLog.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            // Kis user ne kiya?
            user_id: {
                type: DataTypes.UUID,
                allowNull: true, // system operations ke liye null
            },

            // Kis branch me hua? (Multi-tenant)
            branch_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'branches',
                    key: 'id'
                }
            },

            // Kis module me change hua?
            module: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            // CREATE / UPDATE / DELETE / LOGIN / LOGOUT
            action: {
                type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT"),
                allowNull: false,
            },

            // Kis record pe?
            record_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            // Purana data
            old_value: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            // Naya data
            new_value: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            // IP address (optional but important)
            ip_address: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            user_agent: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "AuditLog",
            tableName: "audit_logs",
            timestamps: true,
            updatedAt: false, // log immuatable hota hai
        }
    );

    return AuditLog;
};
