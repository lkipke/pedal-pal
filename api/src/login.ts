import { Router } from 'express';
import User from './database/models/User';
import { generateHashFromPassword, generateSessionToken } from './helpers';

const router = Router();
router.post('/', async (req, res, next) => {
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  if (!username || !password) {
    return res.status(400).send('Malformed authorization header');
  }

  let hashedPassword = generateHashFromPassword(password);
  let user = await User.findOne({
    where: {
      username,
      password: hashedPassword,
    },
    attributes: {
      exclude: ['authToken', 'password'],
    },
  });

  if (!user) {
    return res
      .status(404)
      .send('No user found with that username-password combination.');
  }

  let authToken = await updateAuthToken(username);
  res.cookie('AuthToken', authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    signed: true,
  });

  return res.status(200).json(user.toJSON());
});

async function updateAuthToken(username: string) {
  let sessionToken = generateSessionToken();
  await User.update(
    {
      authToken: sessionToken,
    },
    {
      where: {
        username,
      },
    }
  );

  return sessionToken;
}

export default router;
