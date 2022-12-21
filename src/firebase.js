import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC627-_40vtV1xsDPnmrHzu1q8XX9Qi9mk',
  authDomain: 'auto-twitter-c3781.firebaseapp.com',
  projectId: 'auto-twitter-c3781',
  storageBucket: 'auto-twitter-c3781.appspot.com',
  messagingSenderId: '1012543334829',
  appId: '1:1012543334829:web:960d3652bc18a07cb69924',
  measurementId: 'G-6P2KWEHTWC',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
