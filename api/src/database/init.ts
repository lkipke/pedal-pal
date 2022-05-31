import sequelize from './sequelize';
import User from './models/User';
import { generateHashFromPassword } from '../helpers';

/**
 * This will update the tables if any of the schema was wrong.
 * If FORCE_DB_RESET is true, then it will drop the tables and
 * recreate them.
 *
 * It will also create the owner's user entry in the Users table.
 */
export default async () => {
  let forceReset = process.env.FORCE_DB_RESET === 'true';
  await sequelize.sync({ force: forceReset });

  let user = await User.findOne({
    where: {
      username: process.env.OWNER_USERNAME,
    },
  });

  if (!user) {
    User.create({
      firstName: process.env.OWNER_FIRST_NAME,
      lastName: process.env.OWNER_LAST_NAME,
      username: process.env.OWNER_USERNAME,
      password: generateHashFromPassword(process.env.OWNER_PASSWORD!),
    });
  }
};
