import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessToken } from './accessToken.models';
import { CreateAccessTokenDto } from './dto/create-accessToken.dto';
import { AccessTokenEntity } from './entities/accessTokenEntity';
import { AccessTokenMapper } from './accessToken.mapper';
import { UpdateAccessTokenDto } from './dto/update-accessToken.dto';
import { Op } from 'sequelize';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectModel(AccessToken)
    private readonly accessTokenModel: typeof AccessToken,
  ) {}

  async create(
    createAccessTokenDto: CreateAccessTokenDto,
  ): Promise<AccessTokenEntity> {
    const accessTokenEntity = AccessTokenMapper.toEntity(createAccessTokenDto);
    const accessTokenModel = await this.accessTokenModel.create(
      AccessTokenMapper.toModel(accessTokenEntity),
    );
    return AccessTokenMapper.modelToEntity(accessTokenModel);
  }

  async findByAccessToken(
    accessToken: string,
  ): Promise<AccessTokenEntity | null> {
    const accessTokenModel = await this.accessTokenModel.findOne({
      where: {
        access_token: accessToken,
        expires_in: { [Op.gte]: new Date().toISOString() },
      },
    });
    return accessTokenModel
      ? AccessTokenMapper.modelToEntity(accessTokenModel)
      : null;
  }

  async update(
    accessToken: string,
    updateAccessTokenDto: UpdateAccessTokenDto,
  ): Promise<AccessTokenEntity | null> {
    const result = await this.accessTokenModel.update(
      AccessTokenMapper.toModel(
        AccessTokenMapper.toEntity(updateAccessTokenDto),
      ),
      { where: { access_token: accessToken }, returning: true },
    );

    if (result[0] === 0) {
      return null;
    }

    const updatedAccessToken = result[1][0];
    return updatedAccessToken
      ? AccessTokenMapper.modelToEntity(updatedAccessToken)
      : null;
  }
}
