import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { ChannelRolePermissionsService } from 'src/modules/channelRolePermissions/channelRolePermissions.service';
import { PERMISSION_CHANNEL_KEY } from 'src/modules/channelRolePermissions/decorators/channel-permission.decorator';
import { PermissionFlags } from 'src/modules/channelRolePermissions/guards/permissions.enum';

export class ChannelPermissionGuard implements CanActivate {
    constructor(
        private readonly channelRoleService: ChannelRolePermissionsService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<PermissionFlags>(
            PERMISSION_CHANNEL_KEY,
            context.getHandler(),
        );
        const req: Request = context.switchToHttp().getRequest();
        const channelId = req.params.channelId;
        const userId = req.user.id;
        if (!channelId) {
            throw new ForbiddenException('CANT_HAS_CHANNEL');
        }

        const hasPermission =
            await this.channelRoleService.findPermissionsByChannelIdAndUserId(
                channelId,
                userId,
                requiredPermission,
            );
        if (!hasPermission) {
            throw new ForbiddenException('CANT_ACCESS_RESOURCE');
        }

        return true;
    }
}
