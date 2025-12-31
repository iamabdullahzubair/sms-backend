const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class ClassSectionSubject extends Model { }

    ClassSectionSubject.init({
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
        class_section_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "class_sections", key: "id" },
        },
        subject_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "subjects", key: "id" },
        },
        teacher_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "teachers", key: "id" },
        },
        academic_year_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "academic_years", key: "id" },
        },
    }, {
        sequelize,
        modelName: "ClassSectionSubject",
        tableName: "class_section_subjects",
        timestamps: true,
        indexes: [
            { fields: ['class_section_id'] },
            { fields: ['subject_id'] },
            { fields: ['teacher_id'] },
            { fields: ['branch_id'] },
            { fields: ['academic_year_id'] }
        ],
        uniqueKeys: {
            unique_class_section_subject: {
                fields: ['class_section_id', 'subject_id', 'academic_year_id']
            }
        }
    });

    return ClassSectionSubject;
};
