import { useEffect, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

function MessageList({
  messages,
  isTyping,
  setMessages,
  onRegenerate,
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const isNearBottom =
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
      150;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSaveEdit = (index, newText) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index
          ? {
              ...msg,
              text: newText,
            }
          : msg
      )
    );

    setEditingIndex(null);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-slate-950 px-8 py-8"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {messages.map((message, index) => (
          <ChatBubble
            key={message.id}
            index={index}
            sender={message.sender}
            text={message.text}
            time={message.time}
            image={message.image}
            images={message.images}

            editingIndex={editingIndex}

            onEdit={setEditingIndex}

            onSaveEdit={handleSaveEdit}

            onCancelEdit={() =>
              setEditingIndex(null)
            }

            onRegenerate={onRegenerate}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />

      </div>
    </div>
  );
}

export default MessageList;