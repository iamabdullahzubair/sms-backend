const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class AcademicYear extends Model { }

    AcademicYear.init({
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
        year: {
            type: DataTypes.STRING, // Example: "2024-2025"
            allowNull: false,
            unique: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: "AcademicYear",
        tableName: "academic_years",
        timestamps: true
    });

    return AcademicYear;
};
