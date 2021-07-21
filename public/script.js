const socket = io('/chattings');
const getElementById = (id) => document.getElementById(id) || null;

const formElement = getElementById('chat_form');
const inputElement = getElementById('chat_message_input');
const chattingBoxElement = getElementById('chatting_box');

const displayAllMessage = (data) => {
  //TODO 소켓으로 받아온 모든 데이터 뿌리기
  // chattingBoxElement.appendChild(buildNewMessage(message));
};

socket.on('user_connected', (username) => {
  updateNewChat(`${username} connected!`);
});

socket.on('new_chat', (data) => {
  updateNewChat(`${data.username}: ${data.chat}`);
  console.log(data);
});

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    event.target.elements[0].value = '';
    //TODO
    socket.emit('submit_chat', { data: inputValue });
    updateNewChat(`me : ${inputValue}`);
  }
};

function updateNewChat(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  chattingBoxElement.append(messageElement);
}

function init() {
  const username = prompt('What is your name?');
  updateNewChat('You joined');
  socket.emit('new_user', username); // 유저 등록 -> user_connected on
  if (!(formElement && inputElement && chattingBoxElement))
    alert('Something Worng...🔥');
  else {
    formElement.addEventListener('submit', handleSubmit);
    inputElement.addEventListener('click', () => {});
  }
}

init();
