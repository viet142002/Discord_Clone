import { Module } from '@nestjs/common';
import { MemberController } from 'src/modules/members/member.controller';
import { MemberService } from 'src/modules/members/member.service';
import { UserRoleModule } from 'src/modules/userRoles/userRole.module';

@Module({
    imports: [UserRoleModule],
    controllers: [MemberController],
    providers: [MemberService],
    exports: [MemberService],
})
export class MemberModule {}
