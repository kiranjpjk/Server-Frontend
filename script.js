const ws = new WebSocket("wss://deployserver-production-e1ac.up.railway.app");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");
const usersList = document.getElementById("users");

function printLine(text) {
    const line = document.createElement("div");
    messagesDiv.appendChild(line);

    let i = 0;
    const interval = setInterval(() => {
        line.textContent = text.slice(0, i);
        i++;
        if (i > text.length) clearInterval(interval);
    }, 10);

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

ws.onopen = () => {
    printLine("[CONNECTED TO STAR-C2]");
};

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

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const text = input.value.trim();
        if (text) ws.send(JSON.stringify({ type: "chat", text }));
        input.value = "";
    }
});
