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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
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

const ProductDetail = sequelize.define(
  "product_detail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: { type: DataTypes.STRING, allowNull: true },
    value: { type: DataTypes.STRING, allowNull: true },
    product_id: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: false }
);

const ProductColor = sequelize.define(
  "product_color",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    color_name: { type: DataTypes.STRING, allowNull: true },
    color_code: { type: DataTypes.STRING, allowNull: true },
    product_id: { type: DataTypes.INTEGER },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount: { type: DataTypes.INTEGER, allowNull: true },
    active_discount: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { freezeTableName: false }
);

const ProductSize = sequelize.define(
  "product_size",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    size: { type: DataTypes.STRING, allowNull: true },
    product_id: { type: DataTypes.INTEGER },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount: { type: DataTypes.INTEGER, allowNull: true },
    active_discount: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { freezeTableName: false }
);
export { Product, ProductDetail, ProductColor, ProductSize };
