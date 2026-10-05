import { useState, useEffect, useCallback } from "react";

import Sidebar from "../../components/chat/Sidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import ChatInput from "../../components/chat/ChatInput";

import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../context/AuthContext";
import {
  listConversations,
  createConversation,
  getConversationMessages,
  deleteConversation,
} from "../../services/conversations";

function Chat() {
  const { token } = useAuth();

  // ==========================
  // Pesan Awal
  // ==========================
  const createWelcomeMessage = () => ({
    id: `welcome-${Date.now()}`,
    sender: "ai",
    text: "Halo! Saya Jasmine AI. 👋 Ada yang bisa saya bantu hari ini?",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  // ==========================
  // Conversations (dari backend)
  // ==========================
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Chat ID
  const [activeConversationId, setActiveConversationId] = useState(null);

  // Pesan aktif (di-load dari backend)
  const [messages, setMessages] = useState([createWelcomeMessage()]);

  // Typing
  const [isTyping, setIsTyping] = useState(false);

  // ==========================
  // Load daftar conversations
  // ==========================
  useEffect(() => {
    if (!token) return;

    setLoading(true);

    listConversations(token)
      .then((data) => {
        setConversations(data);

        if (data.length > 0) {
          setActiveConversationId(data[0].id);
        } else {
          // Tidak ada conversation, buat satu
          return createConversation(token).then((conv) => {
            setConversations([conv]);
            setActiveConversationId(conv.id);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // ==========================
  // Load messages saat ganti active conversation
  // ==========================
  useEffect(() => {
    if (!token || !activeConversationId) return;

    let cancelled = false;

    getConversationMessages(token, activeConversationId)
      .then((data) => {
        if (cancelled) return;

        if (data.length > 0) {
          const mapped = data.map((m) => {
            // m.image_data bisa berupa base64 (gambar user) atau JSON array URL (gambar AI)
            let images = null;
            let image = null;

            if (m.image_data) {
              const raw = String(m.image_data);
              if (raw.startsWith("[")) {
                // Gambar AI: JSON array URL
                try {
                  images = JSON.parse(raw);
                } catch {
                  images = null;
                }
              } else if (raw.startsWith("data") || /^[A-Za-z0-9+/=]+$/.test(raw)) {
                // Gambar user: base64
                image = { dataUrl: `data:image/png;base64,${raw}` };
              }
            }

            return {
              id: m.id,
              sender: m.sender,
              text: m.text,
              image,
              images,
              time: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          });

          setMessages(mapped);
        } else {
          setMessages([createWelcomeMessage()]);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setMessages([createWelcomeMessage()]);
      });

    return () => {
      cancelled = true;
    };
  }, [token, activeConversationId]);

  // ==========================
  // Hook Chat
  // ==========================
  const {
    regenerateResponse,
    sendMessage,
  } = useChat({
    messages,
    setMessages,
    setIsTyping,
    conversationId: activeConversationId,
    token,
  });

  // ==========================
  // New Chat
  // ==========================
  const handleNewChat = async () => {
    if (!token) return;

    try {
      const conv = await createConversation(token);
      setConversations((prev) => [conv, ...prev]);
      setActiveConversationId(conv.id);
      setMessages([createWelcomeMessage()]);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Delete Chat
  // ==========================
  const handleDeleteChat = async (id) => {
    if (!token) return;

    try {
      await deleteConversation(token, id);

      const updated = conversations.filter((chat) => chat.id !== id);
      setConversations(updated);

      if (id === activeConversationId) {
        if (updated.length > 0) {
          setActiveConversationId(updated[0].id);
        } else {
          const conv = await createConversation(token);
          setConversations([conv]);
          setActiveConversationId(conv.id);
          setMessages([createWelcomeMessage()]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        Memuat...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex flex-1 flex-col">

        <ChatHeader />

        <MessageList
          messages={messages}
          isTyping={isTyping}
          setMessages={setMessages}
          onRegenerate={regenerateResponse}
        />

        <ChatInput
          messages={messages}
          setMessages={setMessages}
          onSend={sendMessage}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          token={token}
          conversationId={activeConversationId}
        />

      </div>

    </div>
  );
}

export default Chat;
