import { useEffect, useState } from "react";
import { connectWebSocket, sendMessage } from "../websocket";
import VideoPlayer from "../components/VideoPlayer";
import Controls from "../components/Controls";
import Participants from "../components/Participants";
import Chat from "../components/MyChat"; 
import toast from "react-hot-toast";

export default function Room() {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]); // ✅ CHAT STATE

  const roomId = window.location.pathname.split("/")[2];
  const username = new URLSearchParams(window.location.search).get("username");
  const userId = sessionStorage.getItem("userId");

  //  CONNECT SOCKET
 useEffect(() => {
  connectWebSocket(
    roomId,
    username,

    // 🟢 ROOM DATA
    (data) => {
      setRoom(data);
    },

    // 🔥 CHAT DATA
   (chat) => {
  setChatMessages((prev) => {
    const isDuplicate = prev.some(
      (m) =>
        m.message === chat.message &&
        m.username === chat.username
    );

    if (isDuplicate) return prev; // ❌ skip duplicate

    return [...prev, chat];
  });
}
  );
}, []);

  //  KICK HANDLE
  useEffect(() => {
    if (!room) return;

    const exists = Object.values(room.participants || {}).some(
      (p) => p.userId === userId
    );

    if (!exists) {
      toast.error("You were removed by host 🚫");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [room]);

  //  CURRENT USER
  const myUser = Object.values(room?.participants || {}).find(
    (p) => p.userId === userId
  );

  const canControl =
    myUser?.role === "HOST" || myUser?.role === "MODERATOR";

  //  LOADING
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-lg">Loading room...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black blur-3xl -z-10"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-wide">
          🎬 Room: <span className="text-blue-400">{roomId}</span>
        </h1>

        {/* LEAVE */}
        <button
          onClick={() => {
            sendMessage("/app/leave", { roomId, userId });

            toast("Leaving room...");

            setTimeout(() => {
              window.location.href = "/";
            }, 800);
          }}
          className="bg-red-500 px-5 py-2 rounded-xl hover:scale-105 hover:bg-red-600 transition shadow-lg"
        >
          Leave 🚪
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

        {/* VIDEO */}
        <div className="flex-1 bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-5 shadow-xl">

          <VideoPlayer
            room={room}
            roomId={roomId}
            isHost={canControl}
            userId={userId}
            setPlayer={setPlayer}
          />

          <Controls
            roomId={roomId}
            userId={userId}
            canControl={canControl}
            player={player}
          />

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6 w-full lg:w-80">

          <Participants
            participants={room.participants}
            myUser={myUser}
            userId={userId}
            roomId={roomId}
          />

          {/*  CHAT UI */}
          <Chat
            roomId={roomId}
            username={username}
            messages={chatMessages}
          />

        </div>

      </div>
    </div>
  );
}