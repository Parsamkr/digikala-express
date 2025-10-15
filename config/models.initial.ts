import Basket from "../modules/basket/basket.model";
import Discount from "../modules/discount/discount.model";
import {
  Product,
  ProductColor,
  ProductDetail,
  ProductSize,
} from "../modules/product/product.model";
import { RefreshToken } from "../modules/user/refreshToken.model";
import { Otp, User } from "../modules/user/user.model";
import sequelize from "./sequelize.config";

async function initDatabase() {
  Product.hasMany(ProductDetail, {
    foreignKey: "product_id",
    sourceKey: "id",
    as: "details",
  });
  ProductDetail.belongsTo(Product, {
    foreignKey: "product_id",
    targetKey: "id",
    as: "product",
  });

  Product.hasMany(ProductColor, {
    foreignKey: "product_id",
    sourceKey: "id",
    as: "colors",
  });
  ProductColor.belongsTo(Product, {
    foreignKey: "product_id",
    targetKey: "id",
    as: "product",
  });

  Product.hasMany(ProductSize, {
    foreignKey: "product_id",
    sourceKey: "id",
    as: "sizes",
  });
  ProductSize.belongsTo(Product, {
    foreignKey: "product_id",
    targetKey: "id",
    as: "product",
  });

  User.hasOne(Otp, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "otp",
  });
  Otp.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
    as: "user",
  });

  // Add RefreshToken associations if needed
  User.hasMany(RefreshToken, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "refreshTokens",
  });
  RefreshToken.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
    as: "user",
  });

  User.hasMany(Basket, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "basket",
  });
  Basket.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
    as: "user",
  });

  Product.hasMany(Basket, {
    foreignKey: "product_id",
    sourceKey: "id",
    as: "basket",
  });
  Basket.belongsTo(Product, {
    foreignKey: "product_id",
    targetKey: "id",
    as: "product",
  });
  ProductColor.hasMany(Basket, {
    foreignKey: "color_id",
    sourceKey: "id",
    as: "basket",
  });
  Basket.belongsTo(ProductColor, {
    foreignKey: "color_id",
    targetKey: "id",
    as: "color",
  });
  ProductSize.hasMany(Basket, {
    foreignKey: "size_id",
    sourceKey: "id",
    as: "basket",
  });
  Basket.belongsTo(ProductSize, {
    foreignKey: "size_id",
    targetKey: "id",
    as: "size",
  });
  Product.hasMany(Discount, {
    foreignKey: "product_id",
    sourceKey: "id",
    as: "discounts",
  });
  Discount.belongsTo(Product, {
    foreignKey: "product_id",
    targetKey: "id",
    as: "product",
  });
  Basket.hasMany(Discount, {
    foreignKey: "basket_id",
    sourceKey: "id",
    as: "discounts",
  });
  Discount.belongsTo(Basket, {
    foreignKey: "basket_id",
    targetKey: "id",
    as: "basket",
  });
  // Sync all models at once
  await sequelize.sync({ alter: true });
}

export default initDatabase;
