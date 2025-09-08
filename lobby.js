// lobby.js
import { database } from './firebase-config.js';
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const username = localStorage.getItem('username');
const lobbyCode = localStorage.getItem('lobbyCode');

if (!username || !lobbyCode) {
  window.location.href = 'index.html';
}

const lobbyCodeSpan = document.getElementById('lobbyCode');
lobbyCodeSpan.textContent = lobbyCode;

const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const messagesRef = ref(database, `lobbies/${lobbyCode}/messages`);

// Display messages in real time
onValue(messagesRef, (snapshot) => {
  chatBox.innerHTML = '';
  snapshot.forEach(childSnapshot => {
    const msg = childSnapshot.val();
    const div = document.createElement('div');
    div.textContent = `${msg.user}: ${msg.text}`;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
sendBtn.addEventListener('click', async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  await push(messagesRef, { user: username, text });
  messageInput.value = '';
});

// Remove user from lobby when leaving page
window.addEventListener('beforeunload', async () => {
  await remove(ref(database, `lobbies/${lobbyCode}/users/${username}`));
});
