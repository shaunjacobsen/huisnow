import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from './../config/db';
import Property from './Property';

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
  public viewingTime?: Date;
  public viewingNotes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserInterest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    propertyId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isInterested: DataTypes.BOOLEAN,
    hasContacted: DataTypes.BOOLEAN,
    contactedDate: DataTypes.DATE,
    status: DataTypes.STRING,
    viewingTime: DataTypes.DATE,
    viewingNotes: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'user_interests',
    underscored: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ['user_id', 'property_id'] }],
  },
);

// UserInterest.hasOne(Property, {
//   foreignKey: { name: 'id' },
// });

UserInterest.sync({ alter: true }).then(() =>
  console.log('UserInterest table synced'),
);

export default UserInterest;
