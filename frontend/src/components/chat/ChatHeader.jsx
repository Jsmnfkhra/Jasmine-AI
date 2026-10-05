import { Bot } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function ChatHeader() {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-slate-800 flex items-center px-8">

      <Bot
        size={30}
        className="text-cyan-400"
      />

      <h1 className="ml-3 text-2xl font-bold">
        Jasmine AI
      </h1>

      <div className="ml-auto text-sm text-gray-400">
        {user?.username}
      </div>

    </header>
  );
}

export default ChatHeader;