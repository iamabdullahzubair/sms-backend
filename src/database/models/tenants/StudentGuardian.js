const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class StudentGuardian extends Model { }

    StudentGuardian.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        student_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "students", key: "id" },
            onDelete: "CASCADE"
        },
        guardian_type: {
            type: DataTypes.ENUM("father", "mother", "guardian", "other"),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        relation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        occupation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_by: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        updated_by: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: "StudentGuardian",
        tableName: "student_guardians",
        timestamps: true
    });

    return StudentGuardian;
};
