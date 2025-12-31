const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class FeeStructure extends Model { }

    FeeStructure.init(
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
            academic_year_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "academic_years", key: "id" },
            },
            class_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "classes", key: "id" },
            },
            fee_category_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "fee_categories", key: "id" },
            },
            amount: { type: DataTypes.FLOAT, allowNull: false },
        },
        {
            sequelize,
            modelName: "FeeStructure",
            tableName: "fee_structures",
            timestamps: true,
        }
    );

    return FeeStructure;
};
