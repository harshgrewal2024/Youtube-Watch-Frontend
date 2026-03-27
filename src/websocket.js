import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

// 🔐 UNIQUE USER ID
let userId = sessionStorage.getItem("userId");

if (!userId) {
  userId = Math.random().toString(36).substring(2);
  sessionStorage.setItem("userId", userId);
}

// 🔗 CONNECT
export const connectWebSocket = (
  roomId,
  username,
  onRoomMessage,
  onChatMessage // 🔥 NEW
) => {
  if (stompClient && stompClient.connected) return;

  const socket = new SockJS(
    "https://youtube-watch-backend-production.up.railway.app/ws"
  );

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ Connected");

      //  ROOM SUBSCRIBE
      stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        
        const data = JSON.parse(msg.body);
        console.log("Room:",data);
        onRoomMessage && onRoomMessage(data);
      });

      //  CHAT SUBSCRIBE (FIXED)
      stompClient.subscribe(`/topic/chat/${roomId}`, (msg) => {
        
        const data = JSON.parse(msg.body);
        onChatMessage && onChatMessage(data);
      });

      //  JOIN ROOM
      stompClient.publish({
        destination: "/app/join",
        headers: {
          userId: userId,
        },
        body: JSON.stringify({
          roomId: roomId,
          userId: userId,
          username: username || "Guest",
        }),
      });
    },

    onStompError: (frame) => {
      console.error("STOMP ERROR:", frame);
    },

    onWebSocketError: (err) => {
      console.error("WS ERROR:", err);
    },
  });

  stompClient.activate();
};

//  SEND
export const sendMessage = (destination, body) => {
  if (!stompClient || !stompClient.connected) {
    setTimeout(() => {
      sendMessage(destination, body);
    }, 500);
    return;
  }

  stompClient.publish({
    destination,
    headers: {
      userId: userId,
    },
    body: JSON.stringify(body),
  });
};

//  DISCONNECT
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};