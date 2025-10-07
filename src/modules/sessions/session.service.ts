import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSessionDto, Platform } from './dto/CreateSession.dto';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

type SessionSearchParams =
    | { platform?: undefined; sessionId?: string; userId?: string }
    | { platform: Platform; sessionId: string; userId?: string }
    | { platform: Platform; userId: string; sessionId?: string };

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private sessionRepo: Repository<Session>,
    ) {}

    async create(createDto: CreateSessionDto): Promise<Session> {
        return this.sessionRepo.save(createDto);
    }

    async findOne({
        sessionId,
        userId,
        platform,
    }: SessionSearchParams): Promise<Session | null> {
        const query = this.sessionRepo.createQueryBuilder('session');

        if (sessionId) {
            query.andWhere('session.id = :sessionId', { sessionId });
        }
        if (userId) {
            query.andWhere('session.user.id = :userId', { userId });
        }
        if (platform) {
            query.andWhere('session.platform = :platform', { platform });
        }
        return query.getOne();
    }
    async delete(sessionId: string): Promise<void> {
        await this.sessionRepo.delete({ id: sessionId });
    }
}
