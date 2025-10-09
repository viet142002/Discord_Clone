import { ChannelRolePermission } from '@prisma/client';
export class ChannelRolePermissionEntity implements ChannelRolePermission {
    id: string;
    roleId: string | null;
    channelId: string | null;
    canView: boolean;
    canSend: boolean;
    canManage: boolean;

    constructor(partial: Partial<ChannelRolePermissionEntity>) {
        Object.assign(this, partial);
    }
}
