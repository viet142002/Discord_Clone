import { Platform } from './../sessions/dto/CreateSession.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/helpers/bcrypt.helper';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { SessionService } from 'src/modules/sessions/session.service';
import { User } from 'src/modules/users/users.entity';
import { UsersService } from 'src/modules/users/users.service';
import { FindOptionsWhere } from 'typeorm';

interface PayloadToken {
    username: string;
    id: string;
    role: string;
    sessionId: string;
}

@Injectable()
export class AuthService {
    private refreshExpiredIn: number;
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionService: SessionService,
    ) {
        this.refreshExpiredIn = this.configService.get<number>(
            'JWT_REFRESH_EXPIRATION_TIME',
        ) as number;
    }

    async userExists(queries: FindOptionsWhere<User>): Promise<boolean> {
        const user = await this.usersService.findOneQueries(queries);
        return !!user;
    }

    async validateUser(
        loginId: string,
        password: string,
    ): Promise<Omit<User, 'password'>> {
        const user = await this.usersService.findOne(loginId);
        if (!user) {
            throw new UnauthorizedException('USER_NOT_FOUND');
        }
        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('USER_PASSWORD_NOT_VALID');
    }

    async register(user: RegisterDto): Promise<User> {
        return await this.usersService.create(user);
    }

    async login(
        user: LoginDto,
        platform: Platform,
    ): Promise<{
        user: Omit<User, 'password'>;
        accessToken: string;
        refreshToken: string;
    }> {
        const userLogin = await this.validateUser(user.loginId, user.password);
        const exitsSession = await this.sessionService.findOne({
            userId: userLogin.id,
            platform,
        });

        if (exitsSession) {
            await this.sessionService.delete(exitsSession.id);
        }

        const session = await this.sessionService.create({
            userId: userLogin.id,
            device: user.device,
            platform,
        });
        const payload: PayloadToken = {
            sessionId: session.id,
            username: userLogin.username,
            id: userLogin.id,
            role: userLogin.role,
        };
        const token = this.generateTokens(payload);
        return {
            user: userLogin,
            ...token,
        };
    }

    async logout(sessionId: string): Promise<void> {
        await this.sessionService.delete(sessionId);
    }

    generateTokens(payload: PayloadToken): {
        accessToken: string;
        refreshToken: string;
    } {
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
            expiresIn: this.refreshExpiredIn,
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    async verifyToken(
        token: string,
        type: 'access' | 'refresh',
    ): Promise<PayloadToken> {
        try {
            if (type === 'refresh') {
                return this.jwtService.verify(token, {
                    secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
                });
            }
            return this.jwtService.verify(token);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
