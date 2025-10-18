import z from "zod";

const createRoleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
});

const createPermissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
});

const assignPermissionToRoleSchema = z.object({
  role_id: z.number().int().positive(),
  permission_ids: z.array(z.number().int().positive()),
});

export {
  createRoleSchema,
  createPermissionSchema,
  assignPermissionToRoleSchema,
};
