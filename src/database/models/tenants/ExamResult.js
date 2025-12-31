const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class ExamResult extends Model { }

    ExamResult.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        exam_subject_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'exam_subjects', key: 'id' },
        },
        student_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'students', key: 'id' },
        },
        marks_obtained: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        remarks: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'ExamResult',
        tableName: 'exam_results',
        timestamps: true,
    });

    return ExamResult;
};
