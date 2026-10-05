const API_BASE = "/api/chat";

// Kirim pesan + gambar (jika ada) ke backend, lalu stream respons AI.
// Mengembalikan ReadableStream dari fetch agar bisa dibaca chunk per chunk.
export function streamChat({ message, image, conversationId, token }) {
  const formData = new FormData();
  formData.append("message", message);

  if (conversationId) {
    formData.append("conversation_id", String(conversationId));
  }

  if (image) {
    // image berbentuk { data (base64), mimeType }
    if (image.data) {
      formData.append(
        "image",
        base64ToBlob(image.data, image.mimeType),
        "image.png"
      );
    } else if (image.file) {
      formData.append("image", image.file);
    } else if (image.dataUrl) {
      formData.append("image", dataUrlToBlob(image.dataUrl), "image.png");
    }
  }

  return fetch(`${API_BASE}/stream`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

// Konversi base64 (tanpa prefix) + mime type menjadi Blob
function base64ToBlob(base64Data, mimeType = "image/png") {
  const binary = atob(base64Data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mimeType });
}

// Ubah data URL (base64) menjadi Blob
function dataUrlToBlob(dataUrl) {
  const [header, base64Data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

  const binary = atob(base64Data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mimeType });
}

// Kirim chat non-streaming (fallback)
export async function sendChat({ message, conversationId, token }) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId ?? null,
    }),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.detail || "Gagal mengirim pesan");
  }

  return data;
}
