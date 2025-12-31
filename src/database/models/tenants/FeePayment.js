const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class FeePayment extends Model { }

    FeePayment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            student_fee_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: { model: "student_fees", key: "id" },
            },
            payment_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            amount_paid: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            payment_mode: {
                type: DataTypes.ENUM("cash", "online", "bank_transfer", "cheque", "upi", "wallet"),
                allowNull: false,
            },
            payment_status: {
                type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
                defaultValue: "pending",
            },
            transaction_id: {
                type: DataTypes.STRING, // Razorpay/Stripe/Bank txn id
                allowNull: true,
            },
            payment_gateway: {
                type: DataTypes.STRING, // eg: razorpay, paytm, stripe
                allowNull: true,
            },
            payment_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            remarks: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "FeePayment",
            tableName: "fee_payments",
            timestamps: true,
        }
    );

    return FeePayment;
};
