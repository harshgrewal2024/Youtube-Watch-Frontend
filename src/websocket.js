import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

//  UNIQUE USER ID PER TAB
let userId = sessionStorage.getItem("userId");

if (!userId) {
  userId = Math.random().toString(36).substring(2);
  sessionStorage.setItem("userId", userId);
}

//  CONNECT
export const connectWebSocket = (roomId, username, onMessage) => {
  //  avoid multiple connections
  if (stompClient && stompClient.connected) {
   
    return;
  }

  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,

    reconnectDelay: 5000, // auto reconnect

    onConnect: () => {
   

      //  SUBSCRIBE FIRST (important)
      stompClient.subscribe(`/topic/room/${roomId}`, (msg) => {
        const data = JSON.parse(msg.body);
       
        onMessage(data);
      });

      //  THEN JOIN (fix timing issue)
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
     
    },

    onWebSocketError: (err) => {
      
    },
  });

  stompClient.activate();
};

//  SEND MESSAGE
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