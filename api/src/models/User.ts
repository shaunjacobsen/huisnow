import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from './../config/db';

enum UserStatus {
  active,
  disabled,
  deleted,
}

export enum Role {
  user,
  admin,
}

class User extends Model {
  public id!: number;
  public firebaseId!: string;
  public role!: Role;
  public email!: string;
  public avatarUri!: string;
  public status?: UserStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firebaseId: DataTypes.STRING,
    email: DataTypes.STRING,
    avatarUri: DataTypes.STRING,
    status: DataTypes.STRING,
  },
  { sequelize, tableName: 'users', underscored: true, paranoid: true },
);

User.sync({ alter: true }).then(() => console.log('User table synced'));

export default User;
