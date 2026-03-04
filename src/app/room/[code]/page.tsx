"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocketProvider, useSocket } from "@/context/SocketContext";
import { loadNickname } from "@/lib/nickname";
import Lobby from "@/components/Lobby";
import type { Room } from "@/lib/types";

function RoomPageContent() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();

  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"connecting" | "joining" | "joined" | "error">("connecting");

  const handleRoomJoined = useCallback((data: { room: Room }) => {
    setRoom(data.room);
    setStatus("joined");
    setError(null);
  }, []);

  const handleRoomError = useCallback((data: { message: string }) => {
    setError(data.message);
    setStatus("error");
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const nickname = loadNickname() || "Player";

    socket.on("room:joined", handleRoomJoined);
    socket.on("room:error", handleRoomError);

    setStatus("joining");
    socket.emit("room:join", { code, nickname });

    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:error", handleRoomError);
    };
  }, [socket, isConnected, code, handleRoomJoined, handleRoomError]);

  const retroFont = { fontFamily: "var(--font-retro)" };

  // Connecting / joining state
  if (status === "connecting" || status === "joining") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div
            className="text-sm mb-4 animate-pulse"
            style={{ ...retroFont, color: "#00ffff" }}
          >
            {status === "connecting" ? "CONNECTING..." : "JOINING ROOM..."}
          </div>
          <div
            className="text-xs"
            style={{ ...retroFont, color: "#4b5563" }}
          >
            Room: {code}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    const isNotFound = error === "Room not found";
    const isFull = error === "Room is full";

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-lg p-8 text-center"
          style={{
            background: "rgba(17, 24, 39, 0.9)",
            border: "2px solid #ff4444",
            boxShadow: "0 0 20px rgba(255,68,68,0.2)",
          }}
        >
          <div className="text-4xl mb-6">
            {isNotFound ? "?" : "!"}
          </div>
          <h2
            className="text-sm font-bold mb-4"
            style={{ ...retroFont, color: "#ff4444" }}
          >
            {isNotFound ? "ROOM NOT FOUND" : isFull ? "ROOM IS FULL" : "ERROR"}
          </h2>
          <p
            className="text-xs mb-6"
            style={{ ...retroFont, color: "#9ca3af", fontSize: "0.6rem", lineHeight: "1.8" }}
          >
            {isNotFound
              ? `Room "${code}" does not exist or has expired.`
              : isFull
              ? `Room "${code}" already has 4 players.`
              : error}
          </p>

          {isNotFound && (
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded transition-all mb-3"
              style={{
                ...retroFont,
                fontSize: "0.6rem",
                background: "linear-gradient(135deg, #00cc00, #006600)",
                color: "#ffffff",
                border: "2px solid #00ff00",
                boxShadow: "0 0 10px rgba(0,255,0,0.4)",
              }}
            >
              CREATE A NEW ROOM
            </button>
          )}

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded transition-all"
            style={{
              ...retroFont,
              fontSize: "0.6rem",
              background: "transparent",
              color: "#6b7280",
              border: "2px solid #374151",
            }}
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  // Joined — render the full Lobby component
  if (!room || !socket) return null;

  return (
    <Lobby
      room={room}
      currentPlayerId={socket.id ?? ""}
    />
  );
}

export default function RoomPage() {
  return (
    <SocketProvider>
      <RoomPageContent />
    </SocketProvider>
  );
}
