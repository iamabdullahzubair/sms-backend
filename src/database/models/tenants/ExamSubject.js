const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class ExamSubject extends Model { }

    ExamSubject.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        exam_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'exams', key: 'id' },
        },
        subject_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'subjects', key: 'id' },
        },
        exam_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        max_marks: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        passing_marks: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'ExamSubject',
        tableName: 'exam_subjects',
        timestamps: true,
    });

    return ExamSubject;
};
