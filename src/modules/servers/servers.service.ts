import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Server } from './server.entity';

@Injectable()
export class ServersService {
    constructor(
        @InjectRepository(Server)
        private readonly serverRepo: Repository<Server>,
    ) {}

    async create() {}

    async findAll(): Promise<Server[]> {
        return await this.serverRepo.find();
    }
}
