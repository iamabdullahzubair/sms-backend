const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Shift extends Model { }

    Shift.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        branch_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'branches', key: 'id' },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Shift',
        tableName: 'shifts',
        timestamps: true,
    });

    return Shift;
};
