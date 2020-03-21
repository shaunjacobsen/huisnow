import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('huisnow', 'user', 'pass', {
  host: 'localhost',
  dialect: 'postgres',
  port: 35432,
});

sequelize
  .authenticate()
  .then(() => console.log('Database connection established'))
  .catch(() => console.error('Could not establish database connection'));

sequelize.sync();

export default sequelize;
