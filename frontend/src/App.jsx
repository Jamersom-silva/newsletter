import React, { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("https://newsletter-gf9m.onrender.com/subscribe", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMsg(data.message);
      setEmail("");
    } catch {
      setMsg("Erro ao conectar ao servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md p-8 rounded-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Inscreva-se na Newsletter
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Enviando..." : "Inscrever-se"}
          </button>
        </form>

        {msg && (
          <p className="text-center text-gray-700 mt-4">{msg}</p>
        )}
      </div>
    </div>
  );
}
