import { Module } from '@nestjs/common';
import { MemberService } from 'src/modules/members/member.service';

@Module({
    providers: [MemberService],
    exports: [MemberService],
})
export class MemberModule {}
