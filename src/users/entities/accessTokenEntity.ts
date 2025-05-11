export class AccessTokenEntity {
  id?: number;
  access_token: string;
  token_type: string;
  expires_in: Date;
  refresh_token: string;
  scope: string;
}
