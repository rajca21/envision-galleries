import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: 'envision-gallery.firebaseapp.com',
  projectId: 'envision-gallery',
  storageBucket: 'envision-gallery.appspot.com',
  messagingSenderId: '427428108015',
  appId: '1:427428108015:web:76e087aac9a1d334a76d1a',
};

export const app = initializeApp(firebaseConfig);
