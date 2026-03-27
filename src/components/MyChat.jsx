import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../websocket";


export default function MyChat({ roomId, username, messages }) {
  const [msg, setMsg] = useState("");
  const bottomRef=useRef(null);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages])

  const send = () => {
    if (!msg.trim()) return;

    sendMessage(`/app/chat/${roomId}`, {
      username,
      message: msg,
      time: new Date().toLocaleTimeString(),
    });

    setMsg("");
  };

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-4">

      <div className="h-48 overflow-y-auto mb-3 text-sm">
        {messages.map((m, i) => (
          <div key={i} className="mb-1">
            <span className="text-blue-400 font-semibold">
              {m.username}:
            </span>{" "}
            {m.message}
            <span className="text-xs text-gray-400 ml-2">
              {m.time || new Date().toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-1 p-2 rounded bg-black/40 border border-white/10"
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="bg-blue-500 px-3 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
      
    </div>
  );
}