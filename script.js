const API = "";

const input = document.getElementById("topic");
const output = document.getElementById("output");
const historyList = document.getElementById("historyList");

const user = localStorage.getItem("loggedInUser");

if (!user) window.location.href = "index.html";

document.getElementById("userDisplay").innerText = user;

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

async function loadHistory() {
  const res = await fetch(`/history/${user}`);
  const data = await res.json();

  historyList.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    li.onclick = () => {
      input.value = item;
      getNotes();
    };
    historyList.appendChild(li);
  });
}

async function getNotes() {
  const topic = input.value.trim();
  if (!topic) return alert("Enter topic");

  output.innerText = "Loading...";

  try {
    const res = await fetch(`/ai-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();
    output.innerText = data.text;

    await fetch(`/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, topic })
    });

    loadHistory();

  } catch {
    output.innerText = "Error";
  }
}

function startVoiceSearch() {
  const r = new webkitSpeechRecognition();
  r.onresult = e => input.value = e.results[0][0].transcript;
  r.start();
}

function speakNotes() {
  speechSynthesis.speak(new SpeechSynthesisUtterance(output.innerText));
}

function downloadNotes() {
  html2pdf().from(output).save("notes.pdf");
}

loadHistory();
