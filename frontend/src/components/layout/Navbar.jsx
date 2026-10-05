import { Bot, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <Bot
            size={34}
            className="text-cyan-400"
          />

          <h1 className="text-2xl font-bold">
            JASMINE AI
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-8">

          {user ? (
            <>
              <Link to="/chat">
                <Button>
                  Buka Chat
                </Button>
              </Link>

              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary">
                  Masuk
                </Button>
              </Link>

              <Link to="/register">
                <Button>
                  Daftar
                </Button>
              </Link>
            </>
          )}

        </div>

        <button className="md:hidden">
          <Menu size={30} />
        </button>

      </div>

    </nav>
  );
}

export default Navbar;
