const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Exam extends Model { }

    Exam.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            exam_type_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "exam_types", key: "id" },
            },
            academic_year_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "academic_years", key: "id" },
            },
            branch_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "branches", key: "id" },
            },
            start_date: { type: DataTypes.DATEONLY, allowNull: false },
            end_date: { type: DataTypes.DATEONLY, allowNull: false },
        },
        {
            sequelize,
            modelName: "Exam",
            tableName: "exams",
            timestamps: true,
        }
    );

    return Exam;
};
