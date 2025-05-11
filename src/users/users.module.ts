import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AccessToken } from './accessToken.models';
import { AccessTokenService } from './accessToken.service';
import { SpotifyService } from './spotify.service';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';

@Module({
  imports: [SequelizeModule.forFeature([AccessToken])],
  providers: [AccessTokenService, SpotifyService],
  controllers: [AuthController, UserController],
  exports: [AccessTokenService],
})
export class UsersModule {}
