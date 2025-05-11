import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { UserJwtAuthGuard } from '../user-jwt/jwt-auth.guard';

@Controller('user')
@UseGuards(UserJwtAuthGuard)
export class UserController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('followed-artists')
  async followedArtists(@Request() req: any) {
    return this.spotifyService.getFollowedArtists(req.user.access_token);
  }

  //   @Get('currently-playing-track')
  //   async currentlyPlayingTrack(@Request() req: any) {
  //     return this.spotifyService.getCurrentlyPlayingTrack(req.user.access_token);
  //   }

  @Get('stop-current-playback')
  async stopCurrentPlayback(@Request() req: any) {
    return this.spotifyService.stopCurrentPlayback(req.user.access_token);
  }

  @Get('play-track/:trackId')
  async playTrack(@Request() req: any, @Param('trackId') trackId?: string) {
    return this.spotifyService.playTrack(req.user.access_token, trackId);
  }
}
