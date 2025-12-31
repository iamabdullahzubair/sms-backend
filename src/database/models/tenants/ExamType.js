// (e.g., Mid Term, Final, Unit Test)
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class ExamType extends Model { }

    ExamType.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }, // e.g., Midterm, Final, Unit Test
        description: {
            type: DataTypes.STRING,
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'branches', key: 'id' },
        },
    }, {
        sequelize,
        modelName: 'ExamType',
        tableName: 'exam_types',
        timestamps: true,
    });

    return ExamType;
};
