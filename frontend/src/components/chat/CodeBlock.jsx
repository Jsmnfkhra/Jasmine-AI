import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CodeBlock({
  language,
  value,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden my-4 border border-slate-700">

      {/* Header */}
      <div className="bg-slate-900 flex justify-between items-center px-4 py-2">

        <span className="text-sm text-gray-400">
          {language || "code"}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm hover:text-cyan-400 transition"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>

      </div>

      {/* Code */}
      <pre className="bg-black p-4 overflow-x-auto">
        <code>{value}</code>
      </pre>

    </div>
  );
}

export default CodeBlock;