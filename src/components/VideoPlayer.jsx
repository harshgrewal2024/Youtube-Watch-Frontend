import { useEffect, useRef } from "react";
import { sendMessage } from "../websocket";

export default function VideoPlayer({ room, roomId, isHost, userId,setPlayer }) {
  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const isReady = useRef(false);
  const lastSyncTime = useRef(0);

  //  LOAD PLAYER
  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerInstance.current) return;

      playerInstance.current = new window.YT.Player(playerRef.current, {
        height: "390",
        width: "100%",
        videoId: room?.videoId,

        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          autoplay: 1,
        },

        events: {
          onReady: (event) => {
  

            playerInstance.current = event.target;
            isReady.current = true;

           event.target.mute();
           setPlayer(event.target)

            if (room?.videoId) {
              event.target.loadVideoById(room.videoId);
            }

            //  INITIAL SYNC
            setTimeout(() => {
              if (!room) return;

              event.target.seekTo(room.currentTime || 0, true);

              if (room.playing) {
                event.target.playVideo();
              }
            }, 800);
          },

          //  SEEK DETECT (HOST ONLY)
          onStateChange: (event) => {
            if (!isHost) return;
            if (!playerInstance.current) return;

            if (event.data === window.YT.PlayerState.PAUSED) {
              const time = playerInstance.current.getCurrentTime();

              if (Math.abs(time - lastSyncTime.current) < 1) return;

              lastSyncTime.current = time;

            

              sendMessage(`/app/seek/${roomId}`, {
                userId,
                time,
              });
            }
          },
        },
      });
    };

    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    //  CLEANUP (IMPORTANT)
    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
        playerInstance.current = null;
      }
    };
  }, []);

  //  VIDEO CHANGE
  useEffect(() => {
    if (!playerInstance.current || !isReady.current || !room) return;

    const player = playerInstance.current;
    const currentVideo = player.getVideoData()?.video_id;

    if (currentVideo !== room.videoId) {
    

      player.loadVideoById(room.videoId);
      player.seekTo(0, true);
    }
  }, [room?.videoId]);

  //  SYNC LOOP
  useEffect(() => {
    if (!playerInstance.current || !isReady.current || !room) return;

    const player = playerInstance.current;

    if (!player.getPlayerState || typeof player.getCurrentTime !== "function")
      return;

    const currentTime = player.getCurrentTime();
    const targetTime = room.currentTime || 0;

    //  ANTI-JITTER
    if (Math.abs(currentTime - targetTime) > 1.5) {
    
      player.seekTo(targetTime, true);
    }

    const state = player.getPlayerState();

    //  PLAY
    if (room.playing && state !== window.YT.PlayerState.PLAYING) {
      player.playVideo();
    }

    //  PAUSE
    if (!room.playing && state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
    }
  }, [room]);

  //  NO VIDEO STATE
  if (!room?.videoId) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-3xl mb-3">🎬</div>
        <div className="text-lg font-medium">No video selected</div>
        <div className="text-sm mt-1">Host will add soon...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)]">
      <div className="relative">
        <div ref={playerRef}></div>

        {/*  PARTICIPANT BLOCK */}
        {!isHost && <div className="absolute inset-0 z-10"></div>}
      </div>
    </div>
  );
}