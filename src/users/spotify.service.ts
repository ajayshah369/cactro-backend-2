import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyService {
  constructor() {}

  async getSpotifyUserData(accessToken: string): Promise<any> {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data from Spotify');
    }

    return response.json();
  }

  async getFollowedArtists(accessToken: string): Promise<any> {
    const response = await fetch(
      `https://api.spotify.com/v1/me/following?type=artist`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.json();
  }

  // async getCurrentlyPlayingTrack(accessToken: string): Promise<any> {
  //   const response = await fetch(
  //     `https://api.spotify.com/v1/me/player/currently-playing`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );

  //   return response.json();
  // }

  async stopCurrentPlayback(accessToken: string): Promise<any> {
    const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  async playTrack(accessToken: string, trackId?: string): Promise<any> {
    const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context_uri: trackId ?? 'spotify:album:5ht7ItJgpBH7W6vJ5BqpPr',
        offset: {
          position: 0,
        },
        position_ms: 0,
      }),
    });
    return response.json();
  }
}
