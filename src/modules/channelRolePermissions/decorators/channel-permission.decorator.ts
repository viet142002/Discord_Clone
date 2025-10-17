import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ChannelPermissionGuard } from 'src/modules/channelRolePermissions/guards/channelRolePermission.guard';
import { PermissionFlags } from 'src/modules/channelRolePermissions/guards/permissions.enum';

export const PERMISSION_CHANNEL_KEY = 'PERMISSION_CHANNEL_KEY';

export const ChannelPermission = (perm: PermissionFlags) => {
    return applyDecorators(
        SetMetadata(PERMISSION_CHANNEL_KEY, perm),
        UseGuards(ChannelPermissionGuard),
    );
};
