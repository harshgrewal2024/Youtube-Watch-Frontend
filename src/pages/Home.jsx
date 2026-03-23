import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const joinRoom = () => {
    if (!username.trim()) {
      toast.error("Enter username first 😅");
      return;
    }

    if (!roomId.trim()) {
      toast.error("Enter room ID 😅");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      window.location.href = `/room/${roomId.trim()}?username=${encodeURIComponent(
        username.trim(),
      )}`;
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      {/* CARD */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-80 text-center text-white">
        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6 animate-fadeIn">
          🎬 Watch Party
        </h1>

        {/* USERNAME */}
        <input
          className="w-full p-3 mb-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* ROOM ID */}
        <input
          className="w-full p-3 mb-4 text-sm rounded-lg bg-white/20 border border-white/30 placeholder-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          placeholder="Enter Room ID (anything you like)"
          onChange={(e) => setRoomId(e.target.value)}
        />

        {/* BUTTON */}
        <button
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 hover:scale-105"
          }`}
          onClick={joinRoom}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Room"}
        </button>
      </div>
    </div>
  );
}
