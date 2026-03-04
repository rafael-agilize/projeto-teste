"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Room } from "@/lib/types";
import { useSocket } from "@/context/SocketContext";
import PlayerCard from "@/components/PlayerCard";
import Countdown from "@/components/Countdown";

interface LobbyProps {
  room: Room;
  currentPlayerId: string;
}

interface Toast {
  id: number;
  message: string;
}

const retroFont = { fontFamily: "var(--font-retro)" };

let toastCounter = 0;

export default function Lobby({ room: initialRoom, currentPlayerId }: LobbyProps) {
  const { socket } = useSocket();
  const [room, setRoom] = useState<Room>(initialRoom);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [gameStarting, setGameStarting] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const codeCopyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkCopyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync prop changes (e.g. initial room state)
  useEffect(() => {
    setRoom(initialRoom);
  }, [initialRoom]);

  const addToast = useCallback((message: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleRoomUpdated = (data: { room: Room }) => {
      setRoom(data.room);
    };

    const handlePlayerJoined = (data: { player: { id: string; nickname: string; isHost: boolean; isReady: boolean } }) => {
      addToast(`${data.player.nickname} joined!`);
      setRoom((prev) => {
        const exists = prev.players.some((p) => p.id === data.player.id);
        if (exists) return prev;
        return { ...prev, players: [...prev.players, data.player] };
      });
    };

    const handlePlayerLeft = (data: { playerId: string }) => {
      setRoom((prev) => {
        const leaving = prev.players.find((p) => p.id === data.playerId);
        if (leaving) addToast(`${leaving.nickname} left`);
        return {
          ...prev,
          players: prev.players.filter((p) => p.id !== data.playerId),
        };
      });
    };

    const handleCountdown = (data: { count: number }) => {
      setCountdownValue(data.count);
    };

    const handleGameStart = () => {
      setCountdownValue(null);
      setGameStarting(true);
    };

    socket.on("room:updated", handleRoomUpdated);
    socket.on("room:player-joined", handlePlayerJoined);
    socket.on("room:player-left", handlePlayerLeft);
    socket.on("room:countdown", handleCountdown);
    socket.on("room:game-start", handleGameStart);

    return () => {
      socket.off("room:updated", handleRoomUpdated);
      socket.off("room:player-joined", handlePlayerJoined);
      socket.off("room:player-left", handlePlayerLeft);
      socket.off("room:countdown", handleCountdown);
      socket.off("room:game-start", handleGameStart);
    };
  }, [socket, addToast]);

  const me = room.players.find((p) => p.id === currentPlayerId);
  const isHost = me?.isHost ?? false;
  const readyCount = room.players.filter((p) => p.isReady).length;
  const canStart = readyCount >= 2;

  const handleToggleReady = useCallback(() => {
    if (socket && me) {
      socket.emit("room:ready", { ready: !me.isReady });
    }
  }, [socket, me]);

  const handleStart = useCallback(() => {
    if (socket && canStart) {
      socket.emit("room:start");
    }
  }, [socket, canStart]);

  const handleCopyCode = useCallback(() => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(room.code);
      setCodeCopied(true);
      if (codeCopyTimer.current) clearTimeout(codeCopyTimer.current);
      codeCopyTimer.current = setTimeout(() => setCodeCopied(false), 1500);
    }
  }, [room.code]);

  const handleCopyLink = useCallback(() => {
    if (typeof navigator !== "undefined" && typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/room/${room.code}`);
      setLinkCopied(true);
      if (linkCopyTimer.current) clearTimeout(linkCopyTimer.current);
      linkCopyTimer.current = setTimeout(() => setLinkCopied(false), 1500);
    }
  }, [room.code]);

  // 4 slots — fill with players, rest null
  const slots = Array(4).fill(null).map((_, i) => room.players[i] ?? null);

  // Game-starting overlay
  if (gameStarting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p
            className="text-sm animate-pulse"
            style={{
              ...retroFont,
              color: "#00ff00",
              textShadow: "0 0 20px #00ff00",
            }}
          >
            GAME STARTING...
          </p>
          <p
            className="mt-4 text-xs"
            style={{ ...retroFont, color: "#4b5563", fontSize: "0.55rem" }}
          >
            Phase 2 coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Countdown overlay */}
      {countdownValue !== null && (
        <Countdown
          count={countdownValue}
          onComplete={() => setCountdownValue(null)}
        />
      )}

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-40 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="px-4 py-2 rounded shadow-lg transition-all"
            style={{
              ...retroFont,
              fontSize: "0.55rem",
              background: "rgba(17,24,39,0.95)",
              border: "1px solid #00ffff",
              color: "#00ffff",
              boxShadow: "0 0 10px rgba(0,255,255,0.3)",
              animation: "fadeInOut 3s ease forwards",
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header — room code */}
        <div className="text-center mb-8">
          <p
            className="mb-1"
            style={{ ...retroFont, color: "#4b5563", fontSize: "0.5rem", letterSpacing: "0.2em" }}
          >
            ROOM CODE
          </p>

          {/* Large room code */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1
              className="tracking-widest"
              style={{
                ...retroFont,
                fontSize: "2.2rem",
                color: "#00ffff",
                textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff",
                letterSpacing: "0.4em",
              }}
            >
              {room.code}
            </h1>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1 rounded text-xs transition-all"
              style={{
                ...retroFont,
                fontSize: "0.5rem",
                background: codeCopied ? "rgba(0,100,0,0.7)" : "rgba(0,50,80,0.7)",
                color: codeCopied ? "#00ff00" : "#00ffff",
                border: `1px solid ${codeCopied ? "#00ff00" : "#00ffff"}`,
                boxShadow: codeCopied ? "0 0 6px rgba(0,255,0,0.4)" : "0 0 6px rgba(0,255,255,0.2)",
              }}
            >
              {codeCopied ? "COPIED!" : "COPY CODE"}
            </button>
          </div>

          {/* Shareable link */}
          <div className="flex items-center justify-center gap-2">
            <p
              className="truncate max-w-48"
              style={{ ...retroFont, color: "#4b5563", fontSize: "0.48rem" }}
            >
              {typeof window !== "undefined"
                ? `${window.location.origin}/room/${room.code}`
                : `/room/${room.code}`}
            </p>
            <button
              onClick={handleCopyLink}
              className="px-2 py-1 rounded transition-all flex-shrink-0"
              style={{
                ...retroFont,
                fontSize: "0.44rem",
                background: "transparent",
                color: linkCopied ? "#00ff00" : "#6b7280",
                border: `1px solid ${linkCopied ? "#00ff00" : "#374151"}`,
              }}
            >
              {linkCopied ? "COPIED!" : "COPY LINK"}
            </button>
          </div>
        </div>

        {/* 2x2 Player grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {slots.map((player, i) => (
            <PlayerCard
              key={player?.id ?? `empty-${i}`}
              player={player}
              isCurrentUser={player?.id === currentPlayerId}
              onToggleReady={handleToggleReady}
            />
          ))}
        </div>

        {/* Host Start button */}
        {isHost && (
          <div className="mb-4">
            <button
              onClick={handleStart}
              disabled={!canStart}
              title={!canStart ? "Need 2+ ready players" : undefined}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider rounded transition-all"
              style={{
                ...retroFont,
                fontSize: "0.65rem",
                background: canStart
                  ? "linear-gradient(135deg, #cc00cc, #660066)"
                  : "#1f2937",
                color: canStart ? "#ffffff" : "#4b5563",
                border: `2px solid ${canStart ? "#ff00ff" : "#374151"}`,
                boxShadow: canStart ? "0 0 14px rgba(255,0,255,0.5)" : "none",
                cursor: canStart ? "pointer" : "not-allowed",
              }}
            >
              {canStart ? "START GAME" : `START GAME (${readyCount}/2 ready)`}
            </button>
          </div>
        )}

        {/* Status line */}
        <p
          className="text-center text-xs"
          style={{ ...retroFont, color: "#4b5563", fontSize: "0.5rem" }}
        >
          {room.players.length}/{room.maxPlayers} players
          {" · "}
          {isHost ? "You are the host" : "Waiting for host to start"}
          {readyCount > 0 && ` · ${readyCount} ready`}
        </p>
      </div>
    </div>
  );
}
