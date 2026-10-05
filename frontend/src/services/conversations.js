const API_BASE = "/api/conversations";

export async function listConversations(token) {
  const res = await fetch(`${API_BASE}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal memuat conversations");
  }

  return data;
}

export async function createConversation(token, title = "Chat Baru") {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal membuat conversation");
  }

  return data;
}

export async function getConversationMessages(token, conversationId) {
  const res = await fetch(`${API_BASE}/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal memuat pesan");
  }

  return data;
}

export async function renameConversation(token, conversationId, title) {
  const res = await fetch(`${API_BASE}/${conversationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal mengganti judul");
  }

  return data;
}

export async function deleteConversation(token, conversationId) {
  const res = await fetch(`${API_BASE}/${conversationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal menghapus conversation");
  }

  return data;
}
