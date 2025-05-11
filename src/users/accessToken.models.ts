import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class AccessToken extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  access_token: string;

  @Column({
    type: DataType.ENUM('Bearer'),
    allowNull: true,
    defaultValue: 'Bearer',
  })
  token_type: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expires_in: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  refresh_token: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  scope: string;
}
