import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Platform, Prisma, User } from '@prisma/client';
import { comparePassword } from 'src/common/helpers/bcrypt.helper';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SessionService } from 'src/modules/sessions/session.service';
import { UsersService } from 'src/modules/users/users.service';

interface PayloadToken {
    id: string;
    sessionId: string;
}

@Injectable()
export class AuthService {
    private refreshExpiredIn: number;
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionService: SessionService,
    ) {
        this.refreshExpiredIn = this.configService.get<number>(
            'JWT_REFRESH_EXPIRATION_TIME',
        ) as number;
    }

    async userExists(queries: Prisma.UserWhereUniqueInput): Promise<boolean> {
        const user = await this.usersService.findUnique({
            where: queries,
        });
        return !!user;
    }

    async validateUser(
        loginId: string,
        password: string,
    ): Promise<Omit<User, 'password'>> {
        const user = await this.usersService.findUnique({
            where: {
                email: loginId,
            },
        });
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

    async register(
        user: Prisma.UserCreateInput,
    ): Promise<Omit<User, 'password'>> {
        return this.usersService.createUser(user);
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
        const session = await this.prisma.$transaction(async (tx) => {
            const existing = await this.sessionService.findUnique(
                {
                    where: {
                        userId_platform: {
                            userId: userLogin.id,
                            platform,
                        },
                    },
                },
                tx,
            );
            if (existing) {
                await this.sessionService.delete(
                    {
                        where: {
                            userId_platform: {
                                userId: userLogin.id,
                                platform,
                            },
                        },
                    },
                    tx,
                );
            }
            return this.sessionService.create(
                {
                    data: {
                        userId: userLogin.id,
                        platform,
                        device: user.device,
                    },
                },
                tx,
            );
        });
        const payload: PayloadToken = {
            sessionId: session.id,
            id: userLogin.id,
        };
        const token = this.generateTokens(payload);
        return {
            user: userLogin,
            ...token,
        };
    }

    async logout(sessionId: string): Promise<void> {
        await this.sessionService.delete({
            where: {
                id: sessionId,
            },
        });
    }

    async refreshToken(refreshToken: string): Promise<string> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { iat, exp, ...payload } = await this.verifyToken(
            refreshToken,
            'refresh',
        );
        const session = await this.sessionService.findUnique({
            where: {
                id: payload.sessionId,
            },
        });
        if (!session) {
            throw new UnauthorizedException();
        }
        return this.jwtService.sign(payload);
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
    ): Promise<PayloadToken & { iat: number; exp: number }> {
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
