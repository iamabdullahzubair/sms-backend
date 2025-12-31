const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Permission extends Model { }

    Permission.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        privilege_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "privileges", key: "id" },
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
        modelName: "Permission",
        tableName: "permissions",
        timestamps: true
    });

    return Permission;
};
