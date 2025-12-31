const { DataTypes, Model } = require("sequelize");

/**
 * STUDENT MODEL (Profile-Only Table)
 * -----------------------------------
 * This table stores ONLY the core profile details of a student.
 * It intentionally does NOT contain:
 *
 * 1. branch_id
 *    - Because this is a SaaS system where schools may have multiple branches.
 *    - A student may remain in the same branch OR transfer to another branch 
 *      in future academic years.
 *    - Branch-specific data belongs to admission/enrollment flows,
 *      not the student’s identity/profile.
 *    - Therefore `branch_id` is stored in:
 *          - StudentAdmission  -> First branch where student took admission
 *          - StudentEnrollment -> Branch where student is studying in that academic year
 *
 * 2. admission_number or registration_number
 *    - These unique lifetime identifiers belong to the admission process,
 *      not the student profile.
 *    - They are stored in StudentAdmission, because that reflects the
 *      first-time joining information of the student.
 *
 * WHY THIS DESIGN?
 * ----------------
 * - Clean separation of concerns (profile vs admission vs enrollment).
 * - Fully supports multi-branch schools and branch transfers.
 * - Prevents data duplication and schema lock-in.
 * - Scalable for SaaS where different clients follow different rules.
 * - Student table remains universal and future-proof.
 *
 * SUMMARY:
 * ---------
 * Student = Who the student IS    (profile-only)
 * StudentAdmission = How/when they JOINED the school (first admission)
 * StudentEnrollment = Where they are CURRENTLY studying (per-year data)
 */


module.exports = (sequelize) => {
    class Student extends Model { }

    Student.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM("male", "female", "other"),
                allowNull: false,
            },
            blood_group: {
                type: DataTypes.STRING(10),
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            phone: {
                type: DataTypes.STRING,
            },
            dob: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            medical_track: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            emergency_contact: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            photo_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Student",
            tableName: "students",
            timestamps: true,
        }
    );

    return Student;
};
