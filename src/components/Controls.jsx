import { useState } from "react";
import { sendMessage } from "../websocket";
import toast from "react-hot-toast";

export default function Controls({ roomId, userId, canControl,player }) {
  const [videoInput, setVideoInput] = useState("");

  const extractVideoId = (url) => {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };

  return (
    <div className="mt-6 space-y-4">
      {/*  PLAY / PAUSE */}
      <div className="flex justify-center gap-4">
        {/*  PLAY */}
        <button
          className={`px-5 py-2 rounded-lg transition ${
            canControl
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-600 opacity-70 cursor-not-allowed"
          }`}
          onClick={() => {
            if (!canControl) {
              toast.error("Only host/mod can control 😅");
              return;
            }

            if (player) {
              player.unMute(); // SOUND ON HERE
            }

            const time = player?.getCurrentTime() || 0;

            sendMessage(`/app/play/${roomId}`, {
              userId,
              time,
            });
          }}
        >
          ▶ Play
        </button>

        {/*  PAUSE */}
        <button
          className={`px-5 py-2 rounded-lg transition ${
            canControl
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-600 opacity-70 cursor-not-allowed"
          }`}
          onClick={() => {
            if (!canControl) {
              toast.error("Only host/mod can control 😅");
              return;
            }

            const time = player?.getCurrentTime() || 0;

            sendMessage(`/app/pause/${roomId}`, {
              userId,
              time,
            });
          }}
        >
          ⏸ Pause
        </button>
      </div>

      {/*  CHANGE VIDEO */}
      <div className="flex gap-3">
        <input
          value={videoInput}
          onChange={(e) => setVideoInput(e.target.value)}
          placeholder="Paste YouTube link or ID..."
          className="flex-1 p-3 rounded-xl bg-black/40 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          className={`px-5 rounded-xl transition ${
            canControl
              ? "bg-blue-500 hover:scale-105"
              : "bg-gray-600 opacity-70 cursor-not-allowed"
          }`}
          onClick={() => {
            if (!canControl) {
              toast.error("Only host/mod can change video 😅");
              return;
            }

            if (!videoInput.trim()) {
              toast.error("Enter video URL 😅");
              return;
            }

            sendMessage(`/app/changeVideo/${roomId}`, {
              videoId: extractVideoId(videoInput),
            });

            setVideoInput("");
            toast.success("Video changed 🎬");
          }}
        >
          Change
        </button>
      </div>
    </div>
  );
}
