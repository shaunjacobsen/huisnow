import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from './../config/db';
import Property from './Property';
import User from './User';

export enum UserInterestStatus {
  pendingAction,
  contacted,
  awaitingReply,
  showingScheduled,
  viewed,
}

class UserInterest extends Model {
  public id!: number;
  public propertyId!: number;
  public userId!: number;
  public isInterested!: boolean;
  public hasContacted!: boolean;
  public contactedDate?: Date;
  public status!: UserInterestStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserInterest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    propertyId: {
      type: DataTypes.INTEGER,
      references: { model: Property, key: 'id' },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: User, key: 'id' },
    },
    isInterested: DataTypes.BOOLEAN,
    hasContacted: DataTypes.BOOLEAN,
    contactedDate: DataTypes.DATE,
    status: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'user_interests',
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'property_id'] }],
  },
);

UserInterest.sync({ alter: true }).then(() =>
  console.log('UserInterest table synced'),
);

export default UserInterest;
