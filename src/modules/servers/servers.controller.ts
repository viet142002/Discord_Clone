import { Controller, Post } from '@nestjs/common';

@Controller('servers')
export class ServersController {
    constructor() {}

    @Post('create')
    async createServer() {
        return {
            message: 'Server created successfully',
            server: {
                id: 'server_id',
                name: 'server_name',
                description: 'server_description',
                icon_url: 'server_icon_url',
            },
        };
    }

    @Post('join')
    async joinServer() {}

    async leaveServer() {}

    async findServers() {}

    async findServer() {}

    async findServiceOwners() {}
}
