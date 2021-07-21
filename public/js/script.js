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
socket.on('new_chat', (data) => {
  drawNewChat(`${data.username}: ${data.chat}`);
  console.log(data);
});

//* event callback functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    event.target.elements[0].value = '';
    //TODO
    socket.emit('submit_chat', { data: inputValue });
    drawNewChat(`me : ${inputValue}`);
  }
};

//* main logic
function registerEventListener() {
  formElement.addEventListener('submit', handleSubmit);
  inputElement.addEventListener('click', () => {});
}

function getChatting() {
  //TODO 소켓으로 받아온 모든 데이터 뿌리기
  socket.emit('get_chatting');
  socket.once('load_chatting', (data) => {});
  // chattingBoxElement.appendChild(buildNewMessage(message));
}

function helloUser() {
  const username = prompt('What is your name?');
  drawHelloStranger(username);
  socket.emit('new_user', username); // 유저 등록 -> user_connected on
}

function init() {
  helloUser();
  getChatting();
  registerEventListener();
}

init();
