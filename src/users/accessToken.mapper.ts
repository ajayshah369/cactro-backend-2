// users/mappers/user.mapper.ts
import { CreateAccessTokenDto } from './dto/create-accessToken.dto';
import { AccessToken } from './accessToken.models';
import { AccessTokenEntity } from './entities/accessTokenEntity';
import { UpdateAccessTokenDto } from './dto/update-accessToken.dto';

export class AccessTokenMapper {
  static toEntity(
    accessTokenDto: CreateAccessTokenDto | UpdateAccessTokenDto,
  ): AccessTokenEntity {
    return {
      access_token: accessTokenDto.access_token,
      token_type: accessTokenDto.token_type,
      expires_in: new Date(accessTokenDto.expires_in),
      refresh_token: accessTokenDto.refresh_token,
      scope: accessTokenDto.scope,
    };
  }

  static toModel(accessTokenEntity: AccessTokenEntity): Partial<AccessToken> {
    return {
      access_token: accessTokenEntity.access_token,
      token_type: accessTokenEntity.token_type,
      expires_in: accessTokenEntity.expires_in,
      refresh_token: accessTokenEntity.refresh_token,
      scope: accessTokenEntity.scope,
    };
  }

  static modelToEntity(accessTokenModel: AccessToken): AccessTokenEntity {
    return {
      id: accessTokenModel.id,
      access_token: accessTokenModel.access_token,
      token_type: accessTokenModel.token_type,
      expires_in: accessTokenModel.expires_in,
      refresh_token: accessTokenModel.refresh_token,
      scope: accessTokenModel.scope,
    };
  }
}
