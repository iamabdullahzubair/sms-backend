const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class ClassTeacher extends Model {}

    ClassTeacher.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        class_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'id'
            }
        },
        teacher_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'id'
            }
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'branches',
                key: 'id'
            }
        },
        academic_year_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'academic_years',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: "ClassTeacher",
        tableName: "class_teachers",
        timestamps: true
    });

    return ClassTeacher;
};