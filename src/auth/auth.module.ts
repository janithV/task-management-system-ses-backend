/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { LoginStrategy } from './strategy/login.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, LoginStrategy, RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
