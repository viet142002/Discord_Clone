import { Module } from '@nestjs/common';
import { UserRoleService } from 'src/modules/userRoles/userRole.service';

@Module({
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
