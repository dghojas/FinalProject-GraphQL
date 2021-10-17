import * as firebase from 'firebase';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCFdZN-OmOEjw5KoUM5wCNN2prbi7w8MSo",
  authDomain: "gqlreact-969e8.firebaseapp.com",
  projectId: "gqlreact-969e8",
  storageBucket: "gqlreact-969e8.appspot.com",
  // messagingSenderId: "560124509001",
  appId: "1:560124509001:web:61c29aef36f18f97a6b898"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
