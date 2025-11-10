import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

import { env } from './env';

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey,
    }),
    storageBucket: env.firebaseStorageBucket,
  });

export const firebaseApp = getApp();
export const firestore = getFirestore(app);
export const storageBucket = getStorage(app).bucket();

