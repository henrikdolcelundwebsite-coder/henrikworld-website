const chatDiv = document.getElementById('chat');
const offlineDiv = document.getElementById('offline');
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('message-form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

let socket;

// Automatically detect host and port
const HOST = window.location.hostname;      // e.g., localhost or PC IP
const PORT = window.location.port || 3000;  // default to 3000 if empty
const BASE_URL = `http://${HOST}:${PORT}`;

async function init() {
  try {
    // Try to fetch messages from backend
    const res = await fetch(`${BASE_URL}/messages`);

    // If backend does not respond properly, treat as offline
    if (!res.ok) throw new Error('Backend not available');

    const messages = await res.json();
    messages.forEach(addMessage);

    // Show chat, hide offline message
    chatDiv.style.display = 'block';
    offlineDiv.style.display = 'none';

    // WebSocket for live updates
    socket = io(BASE_URL);
    socket.on('new-message', addMessage);

  } catch (err) {
    // Backend not found → show offline message
    chatDiv.style.display = 'none';
    offlineDiv.style.display = 'block';
  }
}

// Display a message
function addMessage({ name, message }) {
  const p = document.createElement('p');
  p.textContent = `${name}: ${message}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send a new message
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = { name: nameInput.value, message: messageInput.value };

  try {
    await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    messageInput.value = '';
  } catch (err) {
    alert('Cannot send message: server offline');
  }
});

init();
