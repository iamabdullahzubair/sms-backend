const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class StudentExamResult extends Model { }

    StudentExamResult.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            exam_schedule_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "exam_schedules", key: "id" },
            },
            student_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "students", key: "id" },
            },
            marks_obtained: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            total_marks: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            remarks: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "StudentExamResult",
            tableName: "student_exam_results",
            timestamps: true,
        }
    );

    return StudentExamResult;
};
