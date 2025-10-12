import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";
import { ProductTypes } from "../../common/constant/product.const";

const Product = sequelize.define(
  "product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active_discount: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ProductTypes)),
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: "updated_at" }
);
