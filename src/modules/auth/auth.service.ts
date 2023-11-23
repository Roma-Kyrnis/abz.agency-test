import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { CreateTokenDTO } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async createToken(token: CreateTokenDTO): Promise<string> {
    const res = await this.tokenRepository.insert(token);
    return res.identifiers[0].id;
  }

  getToken(id: string) {
    return this.tokenRepository.findOneBy({ id });
  }

  async removeToken(token: Token) {
    await this.tokenRepository.remove(token);
  }
}
