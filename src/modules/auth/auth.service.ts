import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/helpers/bcrypt.helper';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { User } from 'src/modules/users/users.entity';
import { UsersService } from 'src/modules/users/users.service';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

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

    async login(user: LoginDto): Promise<{
        user: Omit<User, 'password'>;
        accessToken: string;
        refreshToken: string;
    }> {
        const userLogin = await this.validateUser(user.loginId, user.password);
        const payload = {
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

    generateTokens(payload: Record<string, unknown>): {
        accessToken: string;
        refreshToken: string;
    } {
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        });
        return {
            accessToken,
            refreshToken,
        };
    }
}
