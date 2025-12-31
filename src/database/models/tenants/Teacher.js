const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Teacher extends Model {}

    Teacher.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        joining_date: {
            type: DataTypes.DATE,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'branches',
                key: 'id'
            }
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subject_specialization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM("male", "female", "other"),
            allowNull: true
        },
        photo_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        experience_years: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        emergency_contact: {
            type: DataTypes.STRING,
            allowNull: true
        },
        aadhaar_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salary: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "Teacher",
        tableName: "teachers",
        timestamps: true
    });

    return Teacher;
};
