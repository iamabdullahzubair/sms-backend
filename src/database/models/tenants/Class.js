const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Class extends Model { }

    Class.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        class_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'branches',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: "Class",
        tableName: "classes",
        timestamps: true
    });

    return Class;
};
