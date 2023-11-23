import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import config from '../../config';
import { AuthService } from './auth.service';
import { VerifyTokenJWTPayload } from './dto/token.dto';
import { compare } from 'bcrypt';
import { Token } from './token.entity';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({ success: false, message: 'Add Token Header' });
    }

    try {
      const payload = await this.jwtService.verifyAsync<VerifyTokenJWTPayload>(token, {
        secret: config.env.JWT_SECRET,
      });
      console.log(payload);

      const isValid = await this.validateAndRemoveToken(payload.sub, token);
      if (!isValid) {
        throw new UnauthorizedException({
          success: false,
          message: 'The Token already used or incorrect, please generate new one',
        });
      }
    } catch (error) {
      throw new UnauthorizedException(
        { success: false, message: 'The token expired' },
        { cause: error },
      );
    }
    return true;
  }

  private async validateAndRemoveToken(id: string, token: string): Promise<boolean> {
    const dbToken = await this.authService.getToken(id);
    if (!dbToken) return false;

    const isTokenEquals = await compare(token, dbToken.token);
    if (!isTokenEquals) return false;

    await this.removeUsedToken(dbToken);
    return true;
  }

  private async removeUsedToken(token: Token) {
    await this.authService.removeToken(token);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers[config.constants.AUTH.TOKEN_HEADER];
    return Array.isArray(token) ? token[0] : token;
  }
}
