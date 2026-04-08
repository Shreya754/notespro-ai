const API = "https://notespro-ai.onrender.com";

const input = document.getElementById("topic");

async function getNotes() {
  const topic = input.value.trim();
  if (!topic) return alert("Enter topic");

  document.getElementById("output").innerText = "Loading...";

  try {
    const res = await fetch(`${API}/ai-notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();

    document.getElementById("output").innerText = data.text;

  } catch (err) {
    document.getElementById("output").innerText = "Error";
  }
}
