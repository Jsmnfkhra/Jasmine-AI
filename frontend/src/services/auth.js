const API_BASE = "/api/auth";

export async function registerUser(username, email, password) {
  let res;

  try {
    res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal mendaftar");
  }

  return data;
}

export async function loginUser(email, password) {
  let res;

  try {
    res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal login");
  }

  return data;
}

export async function getMe(token) {
  let res;

  try {
    res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Unauthorized");
  }

  return data;
}
