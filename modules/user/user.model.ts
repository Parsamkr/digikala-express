import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";

const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fullname: { type: DataTypes.STRING, allowNull: true },
    mobile: { type: DataTypes.STRING, allowNull: false },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: false }
);

const Otp = sequelize.define(
  "user_otp",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.INTEGER, allowNull: false },
    expire_at: { type: DataTypes.DATE, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { freezeTableName: true, timestamps: false }
);

export { User, Otp };
