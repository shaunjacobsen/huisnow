import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {});

sequelize
  .authenticate()
  .then(() => console.log('Database connection established'))
  .catch(() => console.error('Could not establish database connection'));

sequelize.sync();

export default sequelize;
