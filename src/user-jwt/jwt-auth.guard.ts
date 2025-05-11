import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserJwtPayload } from './jwt-payload.interface';
import { AccessTokenService } from 'src/users/accessToken.service';

@Injectable()
export class UserJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private accessTokenService: AccessTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserJwtPayload = await this.jwtService.verifyAsync(token);
      const accessToken = await this.accessTokenService.findByAccessToken(
        payload.access_token,
      );
      if (!accessToken) {
        throw new UnauthorizedException();
      }
      request['user'] = accessToken;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    try {
      if (request.headers.cookie) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, token] = request.headers.cookie
          .split(';')
          .map((c) => c.trim())
          .find((c) => c.startsWith('access_token='))
          ?.split('=');
        return token;
      }
    } catch (error) {
      Logger.error(error);
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
