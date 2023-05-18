//-----------------------------
let sname = document.getElementById("sname");
let semail = document.getElementById("semail");

let lname = document.getElementById("lname");
let lemail = document.getElementById("lemail");

let signUPModal = document.getElementById("signUP");
let loginModal = document.getElementById("login");

let pname = localStorage.getItem("name");
let pemail = localStorage.getItem("email");

let myname = document.getElementsByClassName("myname")[0];
let chat = document.getElementsByClassName("chat__section")[0];

if (pname && pemail) {
  signUP.style.display = "none";
  // loginModal.style.display = "inherit";
  chat.style.display = "block";
} else {
  loginModal.style.display = "none";
}

const submit = () => {
  localStorage.setItem("name", sname.value);
  localStorage.setItem("email", semail.value);
  sname.value = "";
  semail.value = "";
  chat.style.display = "block";
  signUP.style.display = "none";
  loginModal.style.display = "none";
  myname.innerHTML = localStorage.getItem("name");
};

const checkLogin = () => {
  console.log("hi");
  if (pname === lname.value && pemail === lemail.value) {
    signUP.style.display = "none";
    loginModal.style.display = "none";
    chat.style.display = "block";
  }
};

const showLogin = () => {
  signUP.style.display = "none";
  chat.style.display = "none";
  loginModal.style.display = "inherit";
};

//-------------------
const socket = io();

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
let name = localStorage.getItem("name");
socket.emit("new-user-joined", name);
myname.innerHTML = localStorage.getItem("name");
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendButton(e) {
  sendMessage(document.getElementById("textarea").value);
}

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };

  // Append

  if (msg.message) {
    appendMessage(msg, "outgoing");
    textarea.value = "";
    scrollToBottom();
    // Send to server
    socket.emit("message", msg);
  } else {
    textarea.value = "";
    alert("Can't send empty message");
  }
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Receive message

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

const appendUser = (msg, type) => {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4> </h4>
        <p>${msg} Joined The Chat</p>
        
    `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
};

const removeUser = (msg, type) => {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
        <h4> </h4>
        <p>${msg} Left The Chat</p>
        
    `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
};

socket.on("user-joined", (msg) => {
  appendUser(msg, "incoming");
});

socket.on("left", (msg) => {
  removeUser(msg, "incoming");
});

// typing animation

let timerId = null;

function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    func();
  }, timer);
}

let typingDiv = document.querySelector(".typing");
socket.on("typing", (data) => {
  typingDiv.innerText = `${data.name} is typing...`;
  debounce(function () {
    typingDiv.innerText = "";
  }, 1000);
});

textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { name: name });
});
