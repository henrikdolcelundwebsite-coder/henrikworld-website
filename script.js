const chatDiv = document.getElementById('chat');
const offlineDiv = document.getElementById('offline');
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('message-form');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

let socket;

async function init() {
  try {
    const res = await fetch('/messages');
    const messages = await res.json();
    messages.forEach(addMessage);

    chatDiv.style.display = 'block';
    offlineDiv.style.display = 'none';

    // WebSocket for live updates
    socket = io();
    socket.on('new-message', addMessage);

  } catch (err) {
    chatDiv.style.display = 'none';
    offlineDiv.style.display = 'block';
  }
}

function addMessage({ name, message }) {
  const p = document.createElement('p');
  p.textContent = `${name}: ${message}`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send new message
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = { name: nameInput.value, message: messageInput.value };
  await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg)
  });
  messageInput.value = '';
});

init();
