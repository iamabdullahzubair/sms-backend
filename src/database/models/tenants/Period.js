const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Period extends Model { }

    Period.init({
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
        is_break: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'Period',
        tableName: 'periods',
        timestamps: true,
    });

    return Period;
};
