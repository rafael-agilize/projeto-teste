"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { SocketProvider, useSocket } from "@/context/SocketContext";
import { loadNickname } from "@/lib/nickname";
import type { Room } from "@/lib/types";

function RoomPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();
  const isCreating = searchParams.get("create") === "true";

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

  const handleRoomUpdated = useCallback((data: { room: Room }) => {
    setRoom(data.room);
  }, []);

  const handlePlayerJoined = useCallback((data: { player: { id: string; nickname: string; isHost: boolean; isReady: boolean } }) => {
    setRoom((prev) => {
      if (!prev) return prev;
      const exists = prev.players.some((p) => p.id === data.player.id);
      if (exists) return prev;
      return { ...prev, players: [...prev.players, data.player] };
    });
  }, []);

  const handlePlayerLeft = useCallback((data: { playerId: string }) => {
    setRoom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: prev.players.filter((p) => p.id !== data.playerId),
      };
    });
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const nickname = loadNickname() || "Player";

    socket.on("room:joined", handleRoomJoined);
    socket.on("room:error", handleRoomError);
    socket.on("room:updated", handleRoomUpdated);
    socket.on("room:player-joined", handlePlayerJoined);
    socket.on("room:player-left", handlePlayerLeft);

    setStatus("joining");

    if (isCreating) {
      socket.emit("room:create", { nickname });
    } else {
      socket.emit("room:join", { code, nickname });
    }

    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:error", handleRoomError);
      socket.off("room:updated", handleRoomUpdated);
      socket.off("room:player-joined", handlePlayerJoined);
      socket.off("room:player-left", handlePlayerLeft);
    };
  }, [socket, isConnected, code, isCreating, handleRoomJoined, handleRoomError, handleRoomUpdated, handlePlayerJoined, handlePlayerLeft]);

  const retroFont = { fontFamily: "var(--font-retro)" };

  // Connecting state
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

  // Joined — show lobby placeholder
  if (!room) return null;

  const mySocketId = socket?.id;
  const me = room.players.find((p) => p.id === mySocketId);
  const isHost = me?.isHost ?? false;

  // Create 4 slots (fill empties)
  const slots = Array(4).fill(null).map((_, i) => room.players[i] || null);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p
            className="text-xs mb-2"
            style={{ ...retroFont, color: "#4b5563", fontSize: "0.55rem" }}
          >
            ROOM CODE
          </p>
          <h1
            className="text-3xl font-bold tracking-widest mb-1"
            style={{
              ...retroFont,
              color: "#00ffff",
              textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff",
              letterSpacing: "0.4em",
            }}
          >
            {room.code}
          </h1>
          <button
            onClick={() => {
              if (typeof navigator !== "undefined") {
                navigator.clipboard.writeText(
                  `${window.location.origin}/room/${room.code}`
                );
              }
            }}
            className="text-xs mt-1"
            style={{ ...retroFont, color: "#6b7280", fontSize: "0.55rem", background: "transparent", border: "none", cursor: "pointer" }}
          >
            COPY LINK
          </button>
        </div>

        {/* Player grid — 2x2 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {slots.map((player, i) => {
            const isEmpty = !player;
            return (
              <div
                key={i}
                className="rounded-lg p-4 flex flex-col items-center justify-center min-h-32"
                style={{
                  background: isEmpty ? "rgba(17, 24, 39, 0.5)" : "rgba(17, 24, 39, 0.9)",
                  border: isEmpty
                    ? "2px dashed #374151"
                    : player.isReady
                    ? "2px solid #00ff00"
                    : "2px solid #00ffff",
                  boxShadow: isEmpty
                    ? "none"
                    : player.isReady
                    ? "0 0 10px rgba(0,255,0,0.2)"
                    : "0 0 10px rgba(0,255,255,0.1)",
                  minHeight: "8rem",
                }}
              >
                {isEmpty ? (
                  <p
                    className="text-center"
                    style={{ ...retroFont, color: "#374151", fontSize: "0.55rem" }}
                  >
                    Waiting for player...
                  </p>
                ) : (
                  <>
                    {player.isHost && (
                      <div className="text-lg mb-1" title="Host">
                        ★
                      </div>
                    )}
                    <p
                      className="text-center font-bold mb-1"
                      style={{
                        ...retroFont,
                        color: player.isReady ? "#00ff00" : "#f9fafb",
                        fontSize: "0.65rem",
                      }}
                    >
                      {player.nickname}
                    </p>
                    {player.id === mySocketId && (
                      <p
                        className="text-xs"
                        style={{ ...retroFont, color: "#4b5563", fontSize: "0.5rem" }}
                      >
                        (you)
                      </p>
                    )}
                    <p
                      className="text-xs mt-1"
                      style={{
                        ...retroFont,
                        color: player.isReady ? "#00ff00" : "#6b7280",
                        fontSize: "0.5rem",
                      }}
                    >
                      {player.isReady ? "READY" : "NOT READY"}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (socket && me) {
                socket.emit("room:ready", { ready: !me.isReady });
              }
            }}
            className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded transition-all"
            style={{
              ...retroFont,
              fontSize: "0.6rem",
              background: me?.isReady
                ? "linear-gradient(135deg, #006600, #003300)"
                : "linear-gradient(135deg, #0088cc, #004488)",
              color: "#ffffff",
              border: `2px solid ${me?.isReady ? "#00ff00" : "#00aaff"}`,
              boxShadow: me?.isReady
                ? "0 0 10px rgba(0,255,0,0.4)"
                : "0 0 10px rgba(0,170,255,0.4)",
            }}
          >
            {me?.isReady ? "NOT READY" : "READY"}
          </button>

          {isHost && (
            <button
              onClick={() => socket?.emit("room:start")}
              disabled={!room.players.filter((p) => p.isReady).length}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded transition-all"
              style={{
                ...retroFont,
                fontSize: "0.6rem",
                background:
                  room.players.filter((p) => p.isReady).length >= 2
                    ? "linear-gradient(135deg, #cc00cc, #660066)"
                    : "#1f2937",
                color:
                  room.players.filter((p) => p.isReady).length >= 2
                    ? "#ffffff"
                    : "#4b5563",
                border: `2px solid ${
                  room.players.filter((p) => p.isReady).length >= 2
                    ? "#ff00ff"
                    : "#374151"
                }`,
                boxShadow:
                  room.players.filter((p) => p.isReady).length >= 2
                    ? "0 0 10px rgba(255,0,255,0.4)"
                    : "none",
                cursor:
                  room.players.filter((p) => p.isReady).length >= 2
                    ? "pointer"
                    : "not-allowed",
              }}
            >
              START GAME
            </button>
          )}
        </div>

        <p
          className="text-center mt-4 text-xs"
          style={{ ...retroFont, color: "#4b5563", fontSize: "0.5rem" }}
        >
          {room.players.length}/{room.maxPlayers} players ·{" "}
          {isHost ? "You are the host" : "Waiting for host to start"}
        </p>
      </div>
    </div>
  );
}

export default function RoomPage() {
  return (
    <SocketProvider>
      <RoomPageContent />
    </SocketProvider>
  );
}
