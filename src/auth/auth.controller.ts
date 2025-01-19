/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FailedResponse, SuccessResponse } from 'src/common/types/response-types';
import { LoginAuthGuard } from 'src/common/guards/login.guard';
import { refreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LoginAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerBody: CreateUserDto) {
    try {
      const result = await this.authService.registerUser(registerBody);

      const successPayload: SuccessResponse = {
        statusCode: 201,
        message: "User created successfully",
        data: result
      }

      delete successPayload.data.password

      return successPayload
    } catch (error) {
        const errorPayload: FailedResponse = {
          statusCode: 400,
          error: error.message ?? "User registration Failed"
        }

        throw new BadRequestException(errorPayload)
    }
  }

  @Public()
  @Get("refresh-token")
  @UseGuards(refreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshUserTokens(@GetCurrentUser() user: string) {
    return this.authService.refreshUserTokens(user);
  }
}
