const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Privileges extends Model {}

    Privileges.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "Privilege",
        tableName: "privileges",
        timestamps: true
    });

    return Privileges;
};
