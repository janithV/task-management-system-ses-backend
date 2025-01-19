/* eslint-disable prettier/prettier */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({});
  }

  async validate(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new UnauthorizedException('Credentials not provided.');
    }

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
