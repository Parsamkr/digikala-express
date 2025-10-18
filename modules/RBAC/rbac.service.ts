import type { NextFunction, Request, Response } from "express";
import { Permission, Role, RolePermission } from "./rbac.model";
import createHttpError from "http-errors";
import { Op } from "@sequelize/core";

const createRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const role = await Role.create({ title, description });
    return res
      .status(201)
      .json({ message: "Role created successfully", data: role });
  } catch (error) {
    next(error);
  }
};

const createPermissionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const permission = await Permission.create({ title, description });
    return res
      .status(201)
      .json({ message: "Permission created successfully", data: permission });
  } catch (error) {
    next(error);
  }
};

const assignPermissionToRoleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role_id, permission_ids } = req.body;
    const role = await Role.findByPk(role_id);
    if (!role) {
      throw createHttpError.NotFound("Role not found");
    }
    const permissions = await Permission.findAll({
      where: { id: { [Op.in]: permission_ids } },
    });
    if (permissions.length !== permission_ids.length) {
      throw createHttpError.NotFound("Some permissions not found");
    }
    const rolePermission = await RolePermission.bulkCreate(
      permissions.map((permission) => ({
        role_id,
        permission_id: permission.get("id"),
      }))
    );
    return res.status(201).json({
      message: "Permission assigned to role successfully",
      data: rolePermission,
    });
  } catch (error) {
    next(error);
  }
};
export {
  createRoleHandler,
  createPermissionHandler,
  assignPermissionToRoleHandler,
};
