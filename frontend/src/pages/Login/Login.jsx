import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/auth";

function Login() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form.email, form.password);
      saveAuth(data.user, data.token);
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-center text-white">
          Selamat Datang Kembali
        </h1>

        <p className="text-gray-400 text-center mt-3">
          Masuk ke akun Jasmine AI Anda
        </p>

        {error && (
          <div className="mt-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mt-8">
            <label className="text-gray-300 block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Password */}
          <div className="mt-6">
            <label className="text-gray-300 block mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {/* Button */}
          <div className="mt-8">
            <Button>
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </div>
        </form>

        {/* Register */}
        <p className="text-center text-gray-400 mt-8">
          Belum punya akun?

          <Link
            to="/register"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Daftar
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
