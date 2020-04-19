import { Sequelize } from 'sequelize';

const url: string | undefined = process.env.DATABASE_URL;

if (!url) throw new Error('No database URL defined');

const sequelize = new Sequelize(url, {});

sequelize
  .authenticate()
  .then(() => console.log('Database connection established'))
  .catch((e: Error) => {
    console.log('db string', process.env.DATABASE_URL);
    console.error('Could not establish database connection');
    console.error(e);
  });

sequelize.sync();

export default sequelize;
