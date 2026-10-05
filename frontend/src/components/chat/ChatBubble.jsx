import {
  Bot,
  User,
  Pencil,
  Copy,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatBubble({
  sender,
  text,
  time,
  index,
  editingIndex,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onRegenerate,
  image,
  images,
}) {
  const isUser = sender === "user";

  const [editText, setEditText] = useState(text);
  const [copied, setCopied] = useState(false);

  const isEditing = editingIndex === index;

  useEffect(() => {
    setEditText(text);
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
          <Bot size={20} />
        </div>
      )}

      <div className="flex flex-col max-w-[75%]">

        {/* ACTION */}
        <div
          className={`flex gap-2 mb-2 opacity-0 group-hover:opacity-100 transition ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          {isUser && (
            <button
              onClick={() => onEdit(index)}
              className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700"
            >
              <Pencil size={15} />
            </button>
          )}

          {!isUser && (
            <button
              onClick={() => onRegenerate(index)}
              className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700"
            >
              <RotateCcw size={15} />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700"
          >
            {copied ? (
              <Check size={15} />
            ) : (
              <Copy size={15} />
            )}
          </button>
        </div>

        {/* BUBBLE */}
        <div
          className={`rounded-2xl px-5 py-4 shadow-lg ${
            isUser
              ? "bg-cyan-500 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          {isEditing ? (
            <div className="space-y-3">

              <input
                value={editText}
                onChange={(e) =>
                  setEditText(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSaveEdit(index, editText);
                  }

                  if (e.key === "Escape") {
                    onCancelEdit();
                  }
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <div className="flex justify-end gap-2">

                <button
                  onClick={onCancelEdit}
                  className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600"
                >
                  <X size={16} />
                </button>

                <button
                  onClick={() =>
                    onSaveEdit(index, editText)
                  }
                  className="rounded-lg bg-cyan-500 px-3 py-2 hover:bg-cyan-600"
                >
                  <Check size={16} />
                </button>

              </div>

            </div>
          ) : (
            <>
              {/* Gambar yang dikirim user */}
              {image && image.dataUrl && (
                <img
                  src={image.dataUrl}
                  alt="Gambar user"
                  className="mb-3 max-h-64 rounded-xl border border-slate-700"
                />
              )}

              {/* Foto yang dikirim AI */}
              {images && images.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {images.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        loading="lazy"
                        className="h-40 w-full rounded-xl object-cover border border-slate-700 hover:opacity-80 transition"
                      />
                    </a>
                  ))}
                </div>
              )}

              {text && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mb-3">
                        {children}
                      </h1>
                    ),

                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mb-2">
                        {children}
                      </h2>
                    ),

                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mb-2">
                        {children}
                      </h3>
                    ),

                    p: ({ children }) => (
                      <p className="leading-7 mb-2">
                        {children}
                      </p>
                    ),

                    ul: ({ children }) => (
                      <ul className="list-disc ml-6 mb-3">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="list-decimal ml-6 mb-3">
                        {children}
                      </ol>
                    ),

                    li: ({ children }) => (
                      <li className="mb-1">
                        {children}
                      </li>
                    ),

                    strong: ({ children }) => (
                      <strong className="font-bold">
                        {children}
                      </strong>
                    ),

                    em: ({ children }) => (
                      <em className="italic">
                        {children}
                      </em>
                    ),

                    code: ({ children, className }) => (
                      <code
                        className={`rounded bg-slate-700 px-1 py-0.5 text-cyan-300 ${
                          className || ""
                        }`}
                      >
                        {children}
                      </code>
                    ),

                    pre: ({ children }) => (
                      <pre className="my-3 overflow-x-auto rounded-xl bg-black p-4">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {text}
                </ReactMarkdown>
              )}
            </>
          )}

          <p
            className={`mt-3 text-xs opacity-70 ${
              isUser
                ? "text-right"
                : "text-left"
            }`}
          >
            {time}
          </p>
        </div>

      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
          <User size={20} />
        </div>
      )}
    </motion.div>
  );
}

export default ChatBubble;