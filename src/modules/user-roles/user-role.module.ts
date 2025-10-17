import { Module } from '@nestjs/common';
import { UserRoleService } from 'src/modules/user-roles/user-role.service';

@Module({
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
