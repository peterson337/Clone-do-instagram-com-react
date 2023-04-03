import firebase from 'firebase';

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyDBNzpwwDDGJ5YBuWCG9I8vT7sqeXagPMI",
    authDomain: "clone-instagram-44ffb.firebaseapp.com",
    projectId: "clone-instagram-44ffb",
    storageBucket: "clone-instagram-44ffb.appspot.com",
    messagingSenderId: "12711349771",
    appId: "1:12711349771:web:3076b1490d0b59e833410e",
    measurementId: "G-2VZ6Q4LVZN"
  });

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export{db, auth, storage, functions};
