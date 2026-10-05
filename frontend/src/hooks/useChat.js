import { useRef } from "react";
import { streamChat } from "../services/chat";

export function useChat({
  messages,
  setMessages,
  setIsTyping,
  conversationId,
  token,
}) {
  const stopRef = useRef(false);

  const streamResponse = async (history, image = null) => {
    stopRef.current = false;

    const aiId = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: aiId,
        sender: "ai",
        text: "",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setIsTyping(true);

    try {
      // Ambil pesan user terakhir sebagai input (pesan paling baru dari user)
      const lastUserMsg = [...history]
        .reverse()
        .find((m) => m.sender === "user");

      const userText = lastUserMsg ? lastUserMsg.text : "";

      // Siapkan image payload untuk backend
      let imagePayload = null;

      if (image && image.data) {
        imagePayload = {
          data: image.data,
          mimeType: image.mimeType,
        };
      }

      const response = await streamChat({
        message: userText,
        image: imagePayload,
        conversationId,
        token,
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung ke server");
      }

      if (!response.body) {
        throw new Error("Streaming tidak didukung");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let images = [];

      // Baca stream SSE: data: <text>\n\n sampai data: [DONE]
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const payload = line.slice(5).trim();

          if (payload === "[DONE]") continue;
          if (payload.startsWith("[ERROR]")) {
            throw new Error(payload.slice(7));
          }

          if (stopRef.current) break;

          // Event khusus: URL gambar AI (JSON array)
          if (payload.startsWith("[IMAGES] ")) {
            try {
              images = JSON.parse(payload.slice("[IMAGES] ".length));
            } catch {
              images = [];
            }
            continue;
          }

          fullText += payload;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiId
                ? {
                    ...msg,
                    text: fullText,
                  }
                : msg
            )
          );
        }
      }

      // Lampirkan gambar (jika ada) ke pesan AI
      if (images.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiId
              ? {
                  ...msg,
                  text: fullText,
                  images,
                }
              : msg
          )
        );
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiId
            ? {
                ...msg,
                text:
                  "Terjadi kesalahan saat menghubungi Jasmine AI.",
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async (text, image = null) => {
    if (!text.trim() && !image) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: text || "[Image]",
      image,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const history = [...messages, userMessage];

    setMessages(history);

    await streamResponse(history, image);
  };

  const regenerateResponse = async (messageIndex) => {
    const history = messages.slice(0, messageIndex);

    setMessages(history);

    await streamResponse(history);
  };

  const stopGenerating = () => {
    stopRef.current = true;
    setIsTyping(false);
  };

  return {
    sendMessage,
    regenerateResponse,
    stopGenerating,
  };
}
