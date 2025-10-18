import { DataTypes } from "@sequelize/core";
import sequelize from "../../config/sequelize.config";

const Role = sequelize.define(
  "role",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  { freezeTableName: true, timestamps: false }
);
const Permission = sequelize.define(
  "permission",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
  },
  { freezeTableName: true, timestamps: false }
);

const RolePermission = sequelize.define(
  "role_permission",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    permission_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { freezeTableName: true, timestamps: false }
);

export { Role, Permission, RolePermission };
