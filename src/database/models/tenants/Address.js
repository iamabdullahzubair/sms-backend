const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Address extends Model { }

    Address.init(
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
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                comment: "users id , students id, parents id, teachers id, admin id --- means any type of users"
            },
            street: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "India",
            },
            postal_code: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            address_type: {
                type: DataTypes.ENUM("permanent", "temporary", "rental"),
                defaultValue: "permanent",
            },
            latitude: {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: true,
            },
            longitude: {
                type: DataTypes.DECIMAL(11, 8),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Address",
            tableName: "addresses",
            timestamps: true,
        }
    );

    return Address;
};
