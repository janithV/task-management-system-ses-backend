/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import * as argon2 from "argon2";
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // validates user presence with given credentials
  async validateUser(username: string, loginPassword: string): Promise<any | null> {
    const user = await this.userModel.findOne({ email: username }).exec()

    if (!user) {
        return null
    }
    
    if (user.status !== 1) {
        throw new ForbiddenException('User is inactive.');
    }
    
    const passwordMatches = await argon2.verify(user.password, loginPassword);

    if (!passwordMatches) {
        return null
    }

   const payload = {
    email: user.email,
    id: user._id.toString(),
    status: user.status
   }

    return payload

}

  //manages the creation of access/refresh tokens after user login validation
  async login(user: any) {
    
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const { accessToken, accessTokenExpiry, refreshToken } = await this.getTokens(payload);

    // update the user refresh token field for future verification
    await this.updateRefreshToken(refreshToken, user.id); 

    return {
      accessToken,
      accessTokenExpiry,
      refreshToken,
    };
  }

  async updateRefreshToken(refreshToken: string, id: string) {
    return await this.userModel.findByIdAndUpdate(id, { refreshToken: refreshToken}, { new: true }).exec()
  }

  // common function to generate access and refresh tokens for a given payload
  async getTokens(payload: any) {

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRES,
    });

    const accessPayload = this.jwtService.decode(accessToken) as {
      exp: number;
    } | null;
    const accessTokenExpiry = accessPayload
      ? new Date(accessPayload.exp * 1000)
      : null;

    return {
      accessToken,
      accessTokenExpiry,
      refreshToken,
    };
  }

  //register user 
  async registerUser(createUserDto: CreateUserDto) {
    try {

      const hasFoundEmail = await this.userModel.findOne({ email: createUserDto.email }).exec()

      if(hasFoundEmail) { // only unique email records are valid
          throw new BadRequestException('Please use a different email to register')  
      }
      
      const hash = await this.hashData(createUserDto.password); // hash password for security
      createUserDto.password = hash
      createUserDto.status = 1
      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();

    } catch (error) {
      throw new Error(error.message ?? "User save failed")
    } 
  }

  // update access token using a refresh token to extend user session
  async refreshUserTokens(userData: any) {
    try {
        const user = await this.userModel.findById(userData.sub).exec()

        if (!user || !user.refreshToken || user.status === 0) {
            throw new ForbiddenException('Access Denied');
        }
        
        const refreshTokenMatches = user.refreshToken === userData.refreshToken

        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

        const payload = {
          email: user.email,
          sub: user.id,
        };

        const { accessToken, accessTokenExpiry, refreshToken } = await this.getTokens(payload)

        await this.updateRefreshToken(refreshToken, user.id)

        return {
            accessToken,
            accessTokenExpiry,
            refreshToken,
        };

    } catch (error) { 
        if(error instanceof ForbiddenException) {
            throw new ForbiddenException(error.message);
        }

        throw new InternalServerErrorException(error)
    }
}

  async hashData(data: string) {
    return await argon2.hash(data);
  }

}
