// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCaVwsucsdOfHgluOKWyp0hG6pxXLuh9Ow",
  authDomain: "lobbyonline-2032f.firebaseapp.com",
  databaseURL: "https://lobbyonline-2032f-default-rtdb.firebaseio.com",
  projectId: "lobbyonline-2032f",
  storageBucket: "lobbyonline-2032f.appspot.com",
  messagingSenderId: "778794073654",
  appId: "1:778794073654:web:662b1f13bbf43ed9f7e297"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
