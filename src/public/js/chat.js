document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName") || "Escribe tu nombre";
  const nameInput = document.getElementById("name-input");
  nameInput.value = userName;

  const socket = io();
  const clientsTotal = document.getElementById("client-total");
  const messageContainer = document.getElementById("message-container");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const messageTone = new Audio(window.location.origin + "/assets/tones/message-tone.mp3");

  messageTone.onerror = () => {
    console.error("Error al cargar el archivo de audio.");
  };

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });

  socket.on("clients-total", (data) => {
    clientsTotal.innerText = `Personas conectadas en la sala: ${data}`;
  });

  function sendMessage() {
    if (messageInput.value === "") return;
    const data = {
      name: nameInput.value,
      message: messageInput.value,
      dateTime: new Date(),
    };
    socket.emit("message", data);
    addMessageToUI(true, data);
    messageInput.value = "";
  }

  socket.on("chat-message", (data) => {
    messageTone.play();
    addMessageToUI(false, data);
  });

  function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>
          `;
    messageContainer.innerHTML += element;
    scrollToBottom();
  }

  function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  }

  messageInput.addEventListener("focus", () => {
    socket.emit("feedback", {
      feedback: `✍️ ${nameInput.value} está escribiendo...`,
    });
  });

  messageInput.addEventListener("keypress", () => {
    socket.emit("feedback", {
      feedback: `✍️ ${nameInput.value} está escribiendo...`,
    });
  });

  messageInput.addEventListener("blur", () => {
    socket.emit("feedback", {
      feedback: "",
    });
  });

  socket.on("feedback", (data) => {
    clearFeedback();
    if (data.feedback) {
      const element = `
            <li class="message-feedback">
              <p class="feedback" id="feedback">${data.feedback}</p>
            </li>
      `;
      messageContainer.innerHTML += element;
      scrollToBottom();
    }
  });

  function clearFeedback() {
    document.querySelectorAll("li.message-feedback").forEach((element) => {
      element.parentNode.removeChild(element);
    });
  }
});
