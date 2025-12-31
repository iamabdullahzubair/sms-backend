const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class FlawLog extends Model { }

    FlawLog.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            branch_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'branches',
                    key: 'id'
                }
            },
            // Which module has the flaw
            module: {
                type: DataTypes.ENUM(
                    "student",
                    "teacher",
                    "class",
                    "academic_year",
                    "admission",
                    "enrollment",
                    "owner_setup",
                    "system"
                ),
                allowNull: false,
            },

            // Short code for each flaw type (fixed identifier)
            flaw_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            // Human readable title
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            // Detailed flaw reason
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            // Related resource
            target_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            // Severity of flaw
            severity: {
                type: DataTypes.ENUM("low", "medium", "high", "critical"),
                defaultValue: "low",
                allowNull: false,
            },

            // Whether flaw is still active
            is_resolved: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            resolved_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },

            resolved_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            meta: {
                type: DataTypes.TEXT,
                allowNull: true, // store any extra info
            },

            created_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },

        },
        {
            sequelize,
            modelName: "FlawLog",
            tableName: "flaw_logs",
            timestamps: true,
        }
    );

    return FlawLog;
};
