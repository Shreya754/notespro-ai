const API = "https://notespro-ai.onrender.com";

let isLogin = true;

document.getElementById("switch").onclick = () => {
  isLogin = !isLogin;
};

async function handleAuth() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  const endpoint = isLogin ? "login" : "signup";

  const res = await fetch(`${API}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: user, password: pass })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("loggedInUser", user);
    window.location.href = "app.html";
  } else {
    alert("Invalid credentials");
  }
}
