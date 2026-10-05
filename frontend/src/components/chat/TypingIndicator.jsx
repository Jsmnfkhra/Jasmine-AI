import { motion } from "framer-motion";

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">

      {/* Avatar AI */}
      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center">
        🤖
      </div>

      {/* Bubble */}
      <div className="bg-slate-800 rounded-2xl px-5 py-4">

        <div className="flex gap-2">

          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: 0,
            }}
          />

          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: 0.2,
            }}
          />

          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: 0.4,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default TypingIndicator;