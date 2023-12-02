import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash as bcryptHash } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

import config from '../../config';
import { AuthService } from './auth.service';
import { SignTokenJWTPayload } from './dto/token.dto';

@Injectable()
export class AuthHttpService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async getToken() {
    try {
      const id = uuidV4();

      const token = await this.jwtService.signAsync({ sub: id } as SignTokenJWTPayload);
      const hash = await this.getHashedToken(token);

      await this.authService.createToken({ id, token: hash });
      return { success: true, token };
    } catch (err) {
      throw new InternalServerErrorException(
        {
          success: false,
          message: 'Internal server error. Please contact to developers team',
        },
        { cause: err },
      );
    }
  }

  private getHashedToken(token: string): Promise<string> {
    return bcryptHash(token, config.env.BCRYPT_SALT_ROUNDS);
  }
}
