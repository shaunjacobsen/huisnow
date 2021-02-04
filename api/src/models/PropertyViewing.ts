import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from './../config/db';
import Property from './Property';
import User from './User';

class PropertyViewing extends Model {
  public id!: number;
  public propertyId!: number;
  public userId!: number;
  public viewingDate!: Date;
  public contactName!: string;
  public contactEmail!: string;
  public contactPhone?: string;
  public preViewingNotes?: string;
  public viewingNotes?: string;
  public pros?: string[];
  public cons?: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PropertyViewing.init(
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
    viewingDate: DataTypes.DATE,
    contactName: { type: DataTypes.STRING, allowNull: true },
    contactEmail: { type: DataTypes.STRING, allowNull: true },
    contactPhone: { type: DataTypes.STRING, allowNull: true },
    preViewingNotes: { type: DataTypes.TEXT, allowNull: true },
    viewingNotes: { type: DataTypes.TEXT, allowNull: true },
    pros: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    cons: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
  },
  {
    sequelize,
    tableName: 'property_viewings',
    indexes: [{ unique: true, fields: ['property_id', 'user_id'] }],
    underscored: true,
  },
);

PropertyViewing.sync({ alter: true }).then(() =>
  console.log('PropertyViewing table synced'),
);

export default PropertyViewing;
