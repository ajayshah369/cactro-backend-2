// sequelize.provider.ts
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AccessToken } from 'src/users/accessToken.models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    global: true,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // set to true if you provide a CA cert
          },
        },
        // logging: (msg) => Logger.verbose(msg, 'Sequelize'),
        logging: false,
        define: {
          underscored: true,
          timestamps: true,
          paranoid: true,
        },
      });

      // Define models
      sequelize.addModels([AccessToken]);

      try {
        await sequelize.authenticate();
        Logger.verbose(
          'Database connection established successfully',
          'Sequelize',
        );
        Logger.verbose(
          `Database Name: ${sequelize.config.database}`,
          'Sequelize',
        );
      } catch (error) {
        Logger.error('Unable to connect to the database:', error, 'Sequelize');
      }

      try {
        await sequelize.sync();
        Logger.verbose('Database synchronized successfully', 'Sequelize');
      } catch (error) {
        Logger.error('Database synchronization failed:', error, 'Sequelize');
      }

      return sequelize;
    },
  },
];
