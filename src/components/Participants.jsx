import { sendMessage } from "../websocket";
import toast from "react-hot-toast";

export default function Participants({
  participants,
  myUser,
  userId,
  roomId,
}) {
  if (!myUser) return null; 

  const canManage =
    myUser.role === "HOST" || myUser.role === "MODERATOR";

  return (
    <div className="w-full lg:w-80 bg-gradient-to-br from-[#0f172a] to-[#020617] border border-white/10 rounded-3xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)]">

      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        👥 Participants
      </h2>

      {Object.values(participants || {}).map((p) => {
        const isMe = p.userId === userId;

        return (
          <div
            key={p.userId}
            className={`flex justify-between items-center py-3 px-3 rounded-xl transition
              ${
                isMe
                  ? "bg-blue-500/10 border border-blue-500/30"
                  : "hover:bg-white/5"
              }
            `}
          >
            {/*  USER */}
            <div className="font-medium">
              {p.username}{" "}
              {isMe && (
                <span className="text-xs text-blue-400">(You)</span>
              )}
            </div>

            {/*  ROLE + ACTIONS */}
            <div className="flex items-center gap-2">

              {/* ROLE */}
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  p.role === "HOST"
                    ? "bg-green-500/20 text-green-400"
                    : p.role === "MODERATOR"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {p.role}
              </span>

              {/*  MAKE MOD */}
              {myUser.role === "HOST" &&
                p.role === "PARTICIPANT" &&
                p.userId !== userId && (
                  <button
                    className="text-xs bg-yellow-500 px-2 py-1 rounded hover:scale-105"
                    onClick={() => {
                      if (!roomId) return;

                      sendMessage(`/app/assignRole/${roomId}`, {
                        userId: p.userId,
                        role: "MODERATOR",
                      });

                      toast.success(`${p.username} is now MOD 👑`);
                    }}
                  >
                    Mod
                  </button>
                )}

              {/*  REMOVE MOD */}
              {myUser.role === "HOST" &&
                p.role === "MODERATOR" &&
                p.userId !== userId && (
                  <button
                    className="text-xs bg-blue-500 px-2 py-1 rounded hover:scale-105"
                    onClick={() => {
                      if (!roomId) return;

                      sendMessage(`/app/assignRole/${roomId}`, {
                        userId: p.userId,
                        role: "PARTICIPANT",
                      });

                      toast.success(`${p.username} is now Participant`);
                    }}
                  >
                    Remove
                  </button>
                )}

              {/* KICK */}
              {canManage && p.userId !== userId && (
                <button
                  className="text-xs bg-red-500 px-2 py-1 rounded hover:scale-105"
                  onClick={() => {
                    if (!roomId) return;

                    sendMessage(`/app/kick/${roomId}`, {
                      userId: p.userId,
                    });

                    toast.success(`${p.username} removed 🚫`);
                  }}
                >
                  Kick
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}