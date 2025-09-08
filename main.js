// main.js
import { database } from './firebase-config.js';
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const usernameInput = document.getElementById('username');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const joinCodeInput = document.getElementById('joinCode');

function generateCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function saveUsername(username) {
  localStorage.setItem('username', username);
}

// Create lobby
createBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert('Enter a username');

  const code = generateCode();
  saveUsername(username);

  // Create lobby in Firebase
  await set(ref(database, 'lobbies/' + code), {
    users: { [username]: true },
    messages: {}
  });

  localStorage.setItem('lobbyCode', code);
  window.location.href = 'lobby.html';
});

// Join lobby
joinBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const code = joinCodeInput.value.trim();
  if (!username || !code) return alert('Enter username and lobby code');

  saveUsername(username);

  const lobbyRef = ref(database, 'lobbies/' + code);
  const snapshot = await get(lobbyRef);

  if (!snapshot.exists()) return alert('Lobby not found!');

  // Add user to lobby (won't overwrite others thanks to rules)
  await set(ref(database, `lobbies/${code}/users/${username}`), true);

  localStorage.setItem('lobbyCode', code);
  window.location.href = 'lobby.html';
});
