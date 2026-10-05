import { useEffect, useRef, useState } from "react";
import {
  SendHorizontal,
  Square,
  Paperclip,
} from "lucide-react";

import { useDragImage } from "../../hooks/useDragImage";

import ImagePreview from "./ImagePreview";

function ChatInput({
  messages,
  setMessages,
  onSend,
  isTyping,
  setIsTyping,
  token,
  conversationId,
}) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    readFile,
  } = useDragImage(setImage);

  // Upload gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    readFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;

    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        if (!file) return;

        readFile(file);

        e.preventDefault();
        break;
      }
    }
  };

  const handleClick = async () => {
    if (isTyping) {
      setIsTyping(false);
      return;
    }

    if (!message.trim() && !image) return;

    await onSend(message, image);

    setMessage("");
    setImage(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-t p-5 transition-all duration-300 ${
        isDragging
          ? "border-cyan-400 bg-cyan-950/30"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <ImagePreview
        image={image}
        onRemove={() => setImage(null)}
      />

      {isDragging && (
        <div className="mb-4 rounded-2xl border-2 border-dashed border-cyan-400 p-8 text-center">
          <p className="text-lg font-semibold text-cyan-300">
            📷 Lepaskan gambar di sini
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Jasmine AI akan menganalisis gambar menggunakan Gemini Vision
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto flex items-center gap-3">

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageChange}
        />

        {/* Upload */}
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isTyping}
          className="rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700 disabled:opacity-60"
        >
          <Paperclip size={20} />
        </button>

        {/* Input */}
        <textarea
          rows={1}
          placeholder="Ketik pesan..."
          value={message}
          disabled={isTyping}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleClick();
            }
          }}
          onPaste={handlePaste}
          className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 outline-none focus:border-cyan-400 disabled:opacity-60"
        />

        {/* Send / Stop */}
        <button
          onClick={handleClick}
          className={`rounded-xl p-4 transition ${
            isTyping
              ? "bg-red-500 hover:bg-red-600"
              : "bg-cyan-500 hover:bg-cyan-600"
          }`}
        >
          {isTyping ? (
            <Square
              size={18}
              fill="white"
            />
          ) : (
            <SendHorizontal size={20} />
          )}
        </button>

      </div>
    </div>
  );
}

export default ChatInput;
