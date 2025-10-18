import Basket from "../modules/basket/basket.model";
import Discount from "../modules/discount/discount.model";
import { Order, OrderItem } from "../modules/order/order.model";
import Payment from "../modules/payment/payment.model";
import {
  Product,
  ProductColor,
  ProductDetail,
  ProductSize,
} from "../modules/product/product.model";
import { Role, Permission, RolePermission } from "../modules/RBAC/rbac.model";
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

  Discount.hasMany(Basket, {
    foreignKey: "discount_id",
    sourceKey: "id",
    as: "baskets",
  });
  Basket.belongsTo(Discount, {
    foreignKey: "discount_id",
    targetKey: "id",
    as: "discount",
  });

  Order.hasMany(OrderItem, {
    foreignKey: "order_id",
    sourceKey: "id",
    as: "order_items",
  });
  OrderItem.belongsTo(Order, {
    foreignKey: "order_id",
    targetKey: "id",
    as: "order",
  });

  Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    sourceKey: "id",
    as: "order_items",
  });
  OrderItem.belongsTo(Product, {
    foreignKey: "product_id",
    targetKey: "id",
    as: "product",
  });

  ProductColor.hasMany(OrderItem, {
    foreignKey: "color_id",
    sourceKey: "id",
    as: "order_items",
  });
  OrderItem.belongsTo(ProductColor, {
    foreignKey: "color_id",
    targetKey: "id",
    as: "color",
  });

  ProductSize.hasMany(OrderItem, {
    foreignKey: "size_id",
    sourceKey: "id",
    as: "order_items",
  });
  OrderItem.belongsTo(ProductSize, {
    foreignKey: "size_id",
    targetKey: "id",
    as: "size",
  });

  User.hasMany(Order, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "orders",
  });
  Order.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
    as: "user",
  });

  Order.hasOne(Payment, {
    foreignKey: "order_id",
    sourceKey: "id",
    as: "payment",
  });
  Payment.belongsTo(Order, {
    foreignKey: "order_id",
    targetKey: "id",
    as: "order",
  });

  User.hasMany(Payment, {
    foreignKey: "user_id",
    sourceKey: "id",
    as: "payments",
  });
  Payment.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "id",
    as: "user",
  });

  Role.hasMany(RolePermission, {
    foreignKey: "role_id",
    sourceKey: "id",
    as: "permissions",
  });
  RolePermission.belongsTo(Role, {
    foreignKey: "role_id",
    targetKey: "id",
  });
  Permission.hasMany(RolePermission, {
    foreignKey: "permission_id",
    sourceKey: "id",
    as: "roles",
  });
  RolePermission.belongsTo(Permission, {
    foreignKey: "permission_id",
    targetKey: "id",
  });
  // Sync all models at once
  await sequelize.sync({ alter: true });
}

export default initDatabase;
