import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { CreateServerDto } from 'src/modules/servers/dto/createServer.dto';
import { ServersService } from 'src/modules/servers/servers.service';

@Controller()
export class ServersController {
    constructor(private serversService: ServersService) {}

    @Get('joined')
    async listServers(@Req() req: Request) {
        const userId = req.user.id;
        return this.serversService.findMany({
            where: { members: { some: { userId } } },
        });
    }

    @Post('create')
    async createServer(
        @Body() createServerDto: CreateServerDto,
        @Req() req: Request,
    ) {
        const serverCreated = await this.serversService.createServer({
            ...createServerDto,
            userId: req.user.id,
        });
        return {
            message: 'CREATE_SERVER_SUCCESSFULLY',
            data: serverCreated,
        };
    }

    @Delete(':id')
    async deleteServer(@Param('id') serverId: string) {
        console.log(serverId);

        await this.serversService.delete({
            where: {
                id: serverId,
            },
        });
        return {
            message: 'DELETE_SERVER_SUCCESSFULLY',
        };
    }

    @Post('leave')
    async leaveServer() {}

    @Get('/')
    async findServers() {}

    @Get(':id')
    async findServer() {}
}
