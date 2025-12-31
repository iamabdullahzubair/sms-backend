const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class User extends Model {}

    User.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            alternate_email: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            phone_number: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            email_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            phone_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            status: {
                type: DataTypes.STRING(50),
                defaultValue: "Active",
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            last_login: {
                type: DataTypes.DATE,
            },
            profile_picture: {
                type: DataTypes.TEXT,
            },
            refresh_token: {
                type: DataTypes.TEXT,
            },
            password_reset_token: {
                type: DataTypes.TEXT,
            },
            password_reset_expires: {
                type: DataTypes.DATE,
            },
            failed_login_attempts: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            last_failed_login_attempt: {
                type: DataTypes.DATE,
            },
            last_password_change: {
                type: DataTypes.DATE,
            },
            default_password_reset_status: {
                type: DataTypes.BOOLEAN,
            },
            
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: true,
        }
    );

    return User;
};
