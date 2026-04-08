let isLogin = true;

document.getElementById("switch").onclick = () => {
  isLogin = !isLogin;
  document.getElementById("title").innerText =
    isLogin ? "Student Login" : "Create Account";
};

async function handleAuth() {
  const user = username.value;
  const pass = password.value;

  if (!user || !pass) return alert("Enter details");

  const endpoint = isLogin ? "login" : "signup";

  try {
    const res = await fetch(`/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("loggedInUser", user);
      window.location.href = "app.html";
    } else {
      alert("Invalid credentials");
    }

  } catch {
    alert("Server error");
  }
}
