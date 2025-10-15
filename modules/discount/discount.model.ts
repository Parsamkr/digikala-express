import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";

const Discount = sequelize.define(
  "discount",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: true },
    code: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: true },
    percentage: { type: DataTypes.INTEGER, allowNull: true },
    limit: { type: DataTypes.INTEGER, allowNull: true },
    usage: { type: DataTypes.INTEGER, allowNull: true },
    expire_at: { type: DataTypes.DATE, allowNull: true },
    type: { type: DataTypes.ENUM("basket", "product"), allowNull: false },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: false }
);

export default Discount;
