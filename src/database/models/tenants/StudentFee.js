const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class StudentFee extends Model { }

    StudentFee.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            student_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "students", key: "id" },
            },
            fee_structure_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "fee_structures", key: "id" },
            },
            total_amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            concession_amount: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
            payable_amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("unpaid", "partial", "paid"),
                defaultValue: "unpaid",
            },
        },
        {
            sequelize,
            modelName: "StudentFee",
            tableName: "student_fees",
            timestamps: true,
        }
    );

    return StudentFee;
};
