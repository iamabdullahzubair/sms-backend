const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class ClassSection extends Model {}

    ClassSection.init({
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
        class_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "classes", key: "id" },
        },
        section_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "sections", key: "id" },
        },
        class_teacher_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "teachers", key: "id" },
        },
        academic_year_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "academic_years", key: "id" },
        },
    }, {
        sequelize,
        modelName: "ClassSection",
        tableName: "class_sections",
        timestamps: true
    });

    return ClassSection;
};
