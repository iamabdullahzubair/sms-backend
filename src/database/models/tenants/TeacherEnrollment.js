const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class TeacherEnrollment extends Model { }

    TeacherEnrollment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },

            teacher_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "teachers",
                    key: "id",
                },
            },

            branch_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "branches",
                    key: "id",
                },
            },

            academic_year_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "academic_years",
                    key: "id",
                },
            },

            enrollment_status: {
                type: DataTypes.ENUM("pending", "approved", "rejected", "withdrawn"),
                defaultValue: "pending",
                allowNull: false,
            },

            enrollment_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },

            approval_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            approved_by: {
                type: DataTypes.UUID,
                allowNull: true,
                comment: "User ID or Admin ID who approved the enrollment",
            },

            documents_submitted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "TeacherEnrollment",
            tableName: "teacher_enrollments",
            timestamps: true,
            indexes: [
                { fields: ["teacher_id"] },
                { fields: ["branch_id"] },
                { fields: ["academic_year_id"] },
                { fields: ["enrollment_status"] },
            ],
        }
    );

    return TeacherEnrollment;
};
