import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";

const Payment = sequelize.define(
  "payment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    refId: { type: DataTypes.STRING, allowNull: true },
    authority: { type: DataTypes.STRING, allowNull: true },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: false }
);

export default Payment;
