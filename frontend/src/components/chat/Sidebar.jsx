import {
  SquarePen,
  MessageSquare,
  Trash2,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function Sidebar({
  conversations,
  activeConversationId,
  setActiveConversationId,
  onNewChat,
  onDeleteChat,
}) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-900 p-2 text-white lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-80
          border-r border-slate-800
          bg-slate-900
          p-6
          transition-transform duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
          lg:static
          lg:flex-shrink-0
        `}
      >
        {/* Close Mobile */}
        <div className="mb-5 flex justify-end lg:hidden">
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* New Chat */}
        <button
          onClick={() => {
            onNewChat();
            setOpen(false);
          }}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 py-4 font-semibold transition hover:bg-cyan-600"
        >
          <SquarePen size={20} />
          Chat Baru
        </button>

        <h2 className="mt-8 mb-4 text-sm uppercase tracking-wider text-slate-400">
          Riwayat Chat
        </h2>

        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">

          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center rounded-xl transition ${
                activeConversationId === chat.id
                  ? "bg-cyan-500"
                  : "hover:bg-slate-800"
              }`}
            >
              {/* Chat Button */}
              <button
                onClick={() => {
                  setActiveConversationId(chat.id);
                  setOpen(false);
                }}
                className="flex min-w-0 flex-1 items-center gap-3 p-3 text-left"
              >
                <MessageSquare
                  size={18}
                  className="flex-shrink-0"
                />

                <span className="truncate text-sm">
                  {chat.title}
                </span>
              </button>

              {/* Delete */}
              <button
                onClick={() => onDeleteChat(chat.id)}
                className="mr-2 flex-shrink-0 rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-red-500 hover:text-white group-hover:opacity-100"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}

        </div>

        {/* User & Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between rounded-xl bg-slate-800 p-3">
            <span className="truncate text-sm text-gray-300">
              {user?.username || "User"}
            </span>

            <button
              onClick={logout}
              className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
              title="Keluar"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;