// (map subject/class to exam with date and time)
const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class ExamSchedule extends Model { }

    ExamSchedule.init(
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
            class_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "classes", key: "id" },
            },
            section_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: { model: "sections", key: "id" },
            },
            subject_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "subjects", key: "id" },
            },
            exam_date: { type: DataTypes.DATEONLY, allowNull: false },
            start_time: { type: DataTypes.TIME, allowNull: false },
            end_time: { type: DataTypes.TIME, allowNull: false },
        },
        {
            sequelize,
            modelName: "ExamSchedule",
            tableName: "exam_schedules",
            timestamps: true,
        }
    );

    return ExamSchedule;
};
