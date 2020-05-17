const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersWrapper = document.getElementById('users');
const socket = io();

// Get user and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    displayRoomName(room);
    displayRoomUsers(users);
});

// Message from server
socket.on('message', message => {
    displayMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    // Emit message to server
    if ( msg.replace(/\s+/, '').length > 0 ) {
        socket.emit('chatMessage', msg);
    }

    // Clear input
    e.target.elements.msg.value = '';

});


// Display message on DOM
const displayMessage = msg => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
       <p class="meta">${msg.username} <span>${msg.time}</span></p>
       <p class="text">${msg.text}</p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};

// Display room name
const displayRoomName = roomName => {
    roomName.innerText = roomName;
};

const displayRoomUsers = users => {
  usersWrapper.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
};