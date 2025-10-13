import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { JoinDto } from 'src/modules/members/dto/join.dto';
import { QueriesMemberInServerDto } from 'src/modules/members/dto/memberInServer.dto';
import { MemberService } from 'src/modules/members/member.service';

@Controller('members')
export class MemberController {
    constructor(private memberService: MemberService) {}

    @Get('/server/:id')
    async memberInServer(
        @Param('id') serviceId: string,
        @Query() queries: QueriesMemberInServerDto,
    ) {
        return this.memberService.findMany({
            where: {
                serverId: serviceId,
            },
            include: queries.include,
        });
    }

    @Post('join')
    async join(@Body() joinDto: JoinDto, @Req() req: Request) {
        const userId = req.user.id;
        await this.memberService.join({
            ...joinDto,
            userId,
        });
        return {
            message: 'JOIN_SUCCESSFULLY',
        };
    }
}
