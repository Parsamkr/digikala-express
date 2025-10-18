import { Router } from "express";
import { validateData } from "../../middleware/validation.middleware";
import {
  assignPermissionToRoleHandler,
  createPermissionHandler,
  createRoleHandler,
} from "./rbac.service";
import {
  assignPermissionToRoleSchema,
  createPermissionSchema,
  createRoleSchema,
} from "./rbac.validtion";
import authGuard from "../auth/auth.guard";

const router = Router();
router.post(
  "/role",
  authGuard,
  validateData(createRoleSchema),
  createRoleHandler
);
router.post(
  "/permission",
  authGuard,
  validateData(createPermissionSchema),
  createPermissionHandler
);
router.post(
  "/assign-permission-to-role",
  authGuard,
  validateData(assignPermissionToRoleSchema),
  assignPermissionToRoleHandler
);

export { router as rbacRouter };
