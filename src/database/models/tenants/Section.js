const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Section extends Model { }

    Section.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        section_name: {
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
        modelName: "Section",
        tableName: "sections",
        timestamps: true
    });

    return Section;
};
