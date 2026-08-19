async function api(path, options = {}) {
  const opts = {
    method: options.method || "GET",
    headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }) },
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  };
  const res = await fetch("/api" + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

async function getCurrentUser() {
  const { user } = await api("/auth/me");
  return user;
}

function renderNav(user) {
  const nav = document.getElementById("nav-links");
  if (!nav) return;
  if (!user) {
    nav.innerHTML = `<a href="/login.html">Login</a><a href="/register.html">Register</a>`;
    return;
  }
  let links = `<span class="muted">Hi, ${user.name}</span>`;
  if (user.role === "admin") {
    links += `<a href="/admin.html">Admin Panel</a>`;
  } else {
    links += `<a href="/index.html">Quizzes</a>`;
  }
  links += `<a href="/leaderboard.html">Leaderboard</a>`;
  links += `<button id="logout-btn">Logout</button>`;
  nav.innerHTML = links;
  document.getElementById("logout-btn").onclick = async () => {
    await api("/auth/logout", { method: "POST" });
    window.location.href = "/login.html";
  };
}

async function requireLogin(role) {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login.html";
    return null;
  }
  if (role && user.role !== role) {
    window.location.href = user.role === "admin" ? "/admin.html" : "/index.html";
    return null;
  }
  renderNav(user);
  return user;
}
