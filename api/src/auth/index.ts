import path from 'path';
import firebaseAdmin from 'firebase-admin';
import firebase from 'firebase';

import User from './../models/User';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require(path.join(
      __dirname,
      '../../flatje-opzoeken-firebase-adminsdk-1plr2-43049aad7c.json',
    )),
  ),
  databaseURL: 'https://flatje-opzoeken.firebaseio.com',
});

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
});

const validateToken = (
  token: string | undefined,
): Promise<firebaseAdmin.auth.DecodedIdToken> => {
  return new Promise<firebaseAdmin.auth.DecodedIdToken>(
    async (resolve, reject) => {
      if (!token) reject();
      try {
        firebaseAdmin
          .auth()
          .verifyIdToken(token!)
          .then(decodedToken => {
            resolve(decodedToken);
          })
          .catch(e => reject(e));
      } catch (e) {
        reject(e);
      }
    },
  );
};

const signIn = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error();

    const firebaseUser = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return {
      firebase: firebaseUser,
      email: user.email,
      id: user.id,
      avatar: user.avatarUri,
    };
  } catch (e) {
    console.log('sign in error', e);
  }
};

interface CreateUserParams {
  email: string;
  password: string;
}

const createUser = async (
  params: CreateUserParams,
): Promise<firebaseAdmin.auth.UserRecord> => {
  const { email, password } = params;
  return firebaseAdmin.auth().createUser({
    email,
    password,
  });
};

export { createUser, signIn, validateToken };
