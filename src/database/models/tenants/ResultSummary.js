// (for dashboard/report cards)
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class ResultSummary extends Model { }

    ResultSummary.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            exam_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "exams", key: "id" },
            },
            student_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "students", key: "id" },
            },
            total_marks: { type: DataTypes.FLOAT, allowNull: false },
            obtained_marks: { type: DataTypes.FLOAT, allowNull: false },
            percentage: { type: DataTypes.FLOAT },
            grade: DataTypes.STRING,
            result_status: {
                type: DataTypes.ENUM("pass", "fail"),
                defaultValue: "pass",
            },
        },
        {
            sequelize,
            modelName: "ResultSummary",
            tableName: "result_summaries",
            timestamps: true,
        }
    );

    return ResultSummary;
};
