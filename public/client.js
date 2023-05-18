const socket = io();

let name;

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");

let myname = document.querySelector(".myname");
do {
  name = prompt("Please enter your name: ");
} while (!name);

socket.emit("new-user-joined", name);
myname.innerHTML = name;
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
