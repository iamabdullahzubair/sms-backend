const { DataTypes, Model } = require("sequelize");

/*

📄 StudentAdmission Model — Explanation (Production Grade)

This model stores the permanent admission record of a student.
It is different from year-wise enrollment and contains only the details related to the first-time admission in the school.

Key points:

1.student_id links to the core students table (student profile).

2.branch_id indicates in which branch the student took admission (useful for multi-branch schools).

3.admission_number is a unique lifetime ID for the student inside the tenant.

4.admission_date stores the official date of joining.

5.documents can contain uploaded admission documents in JSON format (TC, migration, Aadhaar, etc.).

6.created_by and updated_by help in tracking which staff member performed the action.

⚠️ This table does NOT handle class, section, roll number, or academic year.
Those belong to the student_enrollments table where the student gets assigned to:

i)a branch

ii)academic year

iii)class

iv)section

v)roll number

StudentAdmission only stores permanent admission info, not yearly data.

*/


module.exports = (sequelize) => {
    class StudentAdmission extends Model { }

    StudentAdmission.init(
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
                references: { model: 'branches', key: 'id' },
            },
            admission_number: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,   // Permanent unique number
            },

            admission_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            previous_school: DataTypes.STRING,
            documents: DataTypes.TEXT, // TC, Migration, ID proofs etc

            remarks: DataTypes.TEXT,

            created_by: DataTypes.TEXT,
            updated_by: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "StudentAdmission",
            tableName: "student_admissions",
            timestamps: true,
        }
    );

    return StudentAdmission;
};
