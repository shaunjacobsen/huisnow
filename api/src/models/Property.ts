import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from './../config/db';
import UserInterest from './UserInterest';

class Property extends Model {
  public id!: number;
  public source!: string;
  public sourceIdentifier!: string;
  public name!: string;
  public type!: string;
  public streetAddress?: string;
  public postcode?: string;
  public municipality?: string;
  public neighborhood?: string;
  public agent?: string;
  public price!: number;
  public surface?: number;
  public images?: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Property.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    source: DataTypes.STRING,
    sourceIdentifier: DataTypes.STRING,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    postcode: DataTypes.STRING,
    municipality: DataTypes.STRING,
    neighborhood: DataTypes.STRING,
    agent: DataTypes.STRING,
    price: DataTypes.INTEGER,
    surface: DataTypes.INTEGER,
    images: DataTypes.ARRAY(DataTypes.STRING),
  },
  { sequelize, tableName: 'properties', paranoid: true },
);

Property.sync().then(() => console.log('property table synced'));

export default Property;
