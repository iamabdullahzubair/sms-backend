const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class StudentAttendance extends Model {}

  StudentAttendance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      enrollment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "student_enrollments", key: "id" },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      period_id: {
        type: DataTypes.UUID,
        allowNull: true, // if null, it is class-level attendance
        references: { model: "periods", key: "id" },
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "late", "leave"),
        allowNull: false,
        defaultValue: "present",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      recorded_by: {
        type: DataTypes.UUID,
        allowNull: true, // optional teacher/staff ID
      },
    },
    {
      sequelize,
      modelName: "StudentAttendance",
      tableName: "student_attendances",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["enrollment_id", "date", "period_id"],
        },
      ],
    }
  );

  return StudentAttendance;
};
