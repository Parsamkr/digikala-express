import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";

const Basket = sequelize.define(
  "basket",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: true },
    size_id: { type: DataTypes.INTEGER, allowNull: true },
    color_id: { type: DataTypes.INTEGER, allowNull: true },
    discount_id: { type: DataTypes.INTEGER, allowNull: true },
    count: { type: DataTypes.INTEGER, allowNull: true },
  },
  { freezeTableName: true, timestamps: false }
);

export default Basket;
