const ws = new WebSocket("wss://deployserver-production-e1ac.up.railway.app");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");
const usersList = document.getElementById("users");

function printLine(text) {
    const line = document.createElement("div");
    line.textContent = text;
    line.style.opacity = 0;

    messagesDiv.appendChild(line);

    let i = 0;
    const interval = setInterval(() => {
        line.style.opacity = 1;
        line.textContent = text.substring(0, i);
        i++;

        if (i > text.length) clearInterval(interval);
    }, 10);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

ws.onopen = () => printLine("[CONNECTED TO STAR-C2]");

ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "chat") {
        printLine(`${data.user}: ${data.text}`);
    }

    if (data.type === "users") {
        usersList.innerHTML = "";
        data.list.forEach(u => {
            let li = document.createElement("li");
            li.textContent = u;
            usersList.appendChild(li);
        });
    }
};

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const message = input.value.trim();
        if (message !== "") {
            ws.send(JSON.stringify({ type: "chat", text: message }));
        }
        input.value = "";
    }
});
