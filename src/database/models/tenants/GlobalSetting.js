const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class GlobalSetting extends Model { }

    GlobalSetting.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "branches", key: "id" },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },


    }, {
        sequelize,
        modelName: "GlobalSetting",
        tableName: "global_settings",
        timestamps: true
    });

    return GlobalSetting;
};
