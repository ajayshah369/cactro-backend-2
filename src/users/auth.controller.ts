import { Controller, UseGuards, Get, Res, All, Request } from '@nestjs/common';
import { UserJwtAuthGuard } from '../user-jwt/jwt-auth.guard';
import { CreateAccessTokenDto } from './dto/create-accessToken.dto';
import { Response } from 'express';
import { AccessTokenService } from './accessToken.service';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';
import queryString from 'query-string';
import { generateRandomString } from 'src/utils/utilityFunctions';
import { SpotifyService } from './spotify.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly jwtService: JwtService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @Get('login')
  async login(@Res() res: Response) {
    const state = generateRandomString(16);
    const scope =
      'user-read-private user-read-email user-follow-read user-modify-playback-state user-read-currently-playing';
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const redirect_uri = `${process.env.SPOTIFY_REDIRECT_URI}/auth/spotify`;

    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        queryString.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        }),
    );
  }

  @All('spotify')
  async getMeta(@Request() req: any, @Res() res: Response) {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Missing code');
    }

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ':' +
              process.env.SPOTIFY_CLIENT_SECRET,
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.SPOTIFY_REDIRECT_URI}/auth/spotify`,
      }),
    });

    const tokenData = await tokenRes.json();

    const accessTokenDto: CreateAccessTokenDto = {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: new Date(
        new Date().getTime() + tokenData.expires_in * 1000,
      ).toISOString(),
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
    };

    const accessTokenEntity =
      await this.accessTokenService.create(accessTokenDto);

    const token = this.jwtService.sign(
      {
        access_token: accessTokenEntity.access_token,
      },
      {
        expiresIn: ms(tokenData.expires_in * 1000),
      },
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      expires: accessTokenEntity.expires_in,
      sameSite: 'none',
      secure: true,
    });
    res.redirect(`${process.env.SPOTIFY_REDIRECT_URI}/auth`);
  }

  @UseGuards(UserJwtAuthGuard)
  @Get()
  async getAuth(@Request() req: any) {
    const userProfile = await this.spotifyService.getSpotifyUserData(
      req.user.access_token,
    );

    return {
      message: 'Auth success',
      data: userProfile,
    };
  }
}
