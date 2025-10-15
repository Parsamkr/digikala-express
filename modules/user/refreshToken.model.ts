import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";

const RefreshToken = sequelize.define(
  "refresh_token",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { freezeTableName: true, createdAt: "created_at", updatedAt: false }
);

export { RefreshToken };
