const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class StudentEnrollment extends Model { }

    StudentEnrollment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            student_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "students", key: "id" },
            },
            branch_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "branches", key: "id" },
            },
            academic_year_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "academic_years", key: "id" },
            },

            class_section_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "class_sections", key: "id" },
            },
            enrollment_number: {
                type: DataTypes.STRING,
                allowNull: true, // unique only within year + class
            },
            roll_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // unique within (class_section_id + academic_year_id)
                // enforce this at DB index level
            },

            enrollment_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            leaving_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            exit_reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            created_by: DataTypes.TEXT,
            updated_by: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "StudentEnrollment",
            tableName: "student_enrollments",
            timestamps: true,

            // 🔥 Unique roll number constraint per class_section + academic_year
            indexes: [
                {
                    unique: true,
                    fields: ["class_section_id", "academic_year_id", "roll_number"],
                },
            ],
        }
    );

    return StudentEnrollment;
};
