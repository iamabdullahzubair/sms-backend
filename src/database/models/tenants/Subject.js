const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Subject extends Model { }

    Subject.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
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
        modelName: "Subject",
        tableName: "subjects",
        timestamps: true
    });

    return Subject;
};
