// Your Firebase config (already yours)
const firebaseConfig = {
  apiKey: "AIzaSyAwKFoP1NW_hxwRpQvToogweW4xX3ohfBE",
  authDomain: "guestbook-testwebsite.firebaseapp.com",
  projectId: "guestbook-testwebsite",
  storageBucket: "guestbook-testwebsite.firebasestorage.app",
  messagingSenderId: "88207016737",
  appId: "1:88207016737:web:ec2424ff7362622394f460"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference Firestore
const db = firebase.firestore();

// HTML elements
const form = document.getElementById("messageForm");
const container = document.getElementById("messagesContainer");

// Submit a new message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name && message) {
    db.collection("guestbook").add({
      name,
      message,
      timestamp: Date.now()
    }).then(() => form.reset());
  }
});

// Display messages in real-time
db.collection("guestbook").orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    container.innerHTML = "";
    snapshot.forEach((doc) => {
      const div = document.createElement("div");
      div.textContent = `${doc.data().name}: ${doc.data().message}`;
      container.appendChild(div);
    });
  });
