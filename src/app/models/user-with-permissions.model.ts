import { Permission } from "./permission.model";

export interface UserWihtPermissions {
    userId: number;
    name: string;
    username: string;
    permissions: Permission[];
}