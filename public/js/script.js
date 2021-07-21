const socket = io('/chattings');
const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');
const inputElement = getElementById('chat_message_input');

//* draw functions
const drawHelloStranger = (username) =>
  (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);
const drawNewChat = (message) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  chattingBoxElement.append(messageElement);
};

//* global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} connected!`);
});
socket.on('new_chat', (data) => drawNewChat(`${data.username}: ${data.chat}`));
socket.on('disconnect_user', (username) => drawNewChat(`${username}: bye...`));

//* event callback functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    event.target.elements[0].value = '';
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me : ${inputValue}`);
  }
};

//* main logic
function registerEventListener() {
  formElement.addEventListener('submit', handleSubmit);
  inputElement.addEventListener('click', () => {});
}

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username);
  socket.once('hello_user', (username) => {
    drawHelloStranger(username);
  });
}

function init() {
  helloUser();
  registerEventListener();
}

init();
