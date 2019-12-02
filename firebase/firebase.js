import firebase from 'firebase/app';
import 'firebase/database';

let firebaseConfig = {
    apiKey: "AIzaSyAaI71MTS1gfeFk6RwBoLFf_eTTknSHlkw",
    authDomain: "chat-app-52f62.firebaseapp.com",
    databaseURL: "https://chat-app-52f62.firebaseio.com",
    projectId: "chat-app-52f62",
    storageBucket: "chat-app-52f62.appspot.com",
    messagingSenderId: "762254551362",
    appId: "1:762254551362:web:b3a0fa8d06c325962380db"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase
