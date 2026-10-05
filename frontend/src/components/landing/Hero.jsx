import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full -top-24 -left-24"></div>

      <div className="absolute w-80 h-80 bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0"></div>

      <div className="max-w-7xl mx-auto px-8 min-h-[90vh] flex flex-col md:flex-row items-center">

        {/* LEFT */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-cyan-400 font-semibold">
            🤖 Asisten AI
          </p>

          <h1 className="text-6xl md:text-7xl font-bold mt-6 leading-tight">
            Teman AI
            <br />
            <span className="text-cyan-400">
              Pribadimu
            </span>
          </h1>

          <p className="mt-8 text-gray-400 text-xl leading-9 max-w-xl">
            Chat, belajar, brainstorming,
            coding, mencari ide,
            dan ditemani AI yang selalu siap
            membantumu kapan saja.
          </p>

          <div className="flex gap-5 mt-10">

            <Button onClick={() => navigate("/chat")}>
              Mulai Chat
            </Button>

          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="flex-1 flex justify-center mt-20 md:mt-0"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-96 h-96 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Bot
              size={180}
              className="text-cyan-400"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;