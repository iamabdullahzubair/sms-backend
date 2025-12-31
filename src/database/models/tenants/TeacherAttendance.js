const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class TeacherAttendance extends Model { }

    TeacherAttendance.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            teacher_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "teachers", key: "id" },
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            check_in: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            check_out: {
                type: DataTypes.TIME,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("present", "absent", "leave", "half-day"),
                allowNull: false,
                defaultValue: "present",
            },
            shift_id: {
                type: DataTypes.UUID,
                allowNull: true,
                references: { model: "shifts", key: "id" },
            },
            source: {
                type: DataTypes.ENUM("manual", "biometric"),
                defaultValue: "manual",
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "TeacherAttendance",
            tableName: "teacher_attendances",
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ["teacher_id", "date"],
                },
            ],
        }
    );

    return TeacherAttendance;
};
