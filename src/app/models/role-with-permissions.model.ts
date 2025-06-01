import { Permission } from "./permission.model";

export interface RoleWithPermissions {
  id: number;
  name: string;
  permissions: Permission[];
}
