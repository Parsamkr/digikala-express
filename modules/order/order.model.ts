import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";
import { OrderStatuses } from "../../common/constant/order.const";

const Order = sequelize.define(
  "order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatuses)),
      allowNull: false,
      defaultValue: OrderStatuses.Pending,
    },
    address: { type: DataTypes.TEXT, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    final_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discount_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: false }
);

const OrderItem = sequelize.define(
  "order_item",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    size_id: { type: DataTypes.INTEGER, allowNull: true },
    color_id: { type: DataTypes.INTEGER, allowNull: true },
    count: { type: DataTypes.INTEGER, allowNull: false },
  },
  { freezeTableName: true, timestamps: false }
);

export { Order, OrderItem };
