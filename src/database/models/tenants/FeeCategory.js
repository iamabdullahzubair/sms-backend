const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class FeeCategory extends Model { }

    FeeCategory.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            branch_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "branches", key: "id" },
            },
            name: { type: DataTypes.STRING, allowNull: false },  // e.g., Tuition, Transport
            description: { type: DataTypes.STRING },
            is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
        },
        {
            sequelize,
            modelName: "FeeCategory",
            tableName: "fee_categories",
            timestamps: true,
        }
    );

    return FeeCategory;
};
