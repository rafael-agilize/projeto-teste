"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/lib/types";

interface PlayerCardProps {
  player: Player | null;
  isCurrentUser: boolean;
  onToggleReady: () => void;
}

const retroFont = { fontFamily: "var(--font-retro)" };

export default function PlayerCard({
  player,
  isCurrentUser,
  onToggleReady,
}: PlayerCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (player) {
      // Small delay lets the DOM paint before triggering the fade-in
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [player?.id]); // re-run when a different player fills this slot

  // --- Empty slot ---
  if (!player) {
    return (
      <div
        className="rounded-lg p-4 flex flex-col items-center justify-center"
        style={{
          background: "rgba(17, 24, 39, 0.4)",
          border: "2px dashed #374151",
          minHeight: "9rem",
        }}
      >
        <p
          className="text-center"
          style={{ ...retroFont, color: "#374151", fontSize: "0.55rem" }}
        >
          Waiting for player...
        </p>
      </div>
    );
  }

  // --- Filled slot ---
  const borderColor = player.isReady ? "#00ff00" : "#00ffff";
  const bgColor = player.isReady
    ? "rgba(0,40,0,0.85)"
    : "rgba(17, 24, 39, 0.9)";
  const glowColor = player.isReady
    ? "rgba(0,255,0,0.25)"
    : "rgba(0,255,255,0.1)";

  return (
    <div
      className="rounded-lg p-4 flex flex-col items-center justify-center transition-all duration-300"
      style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 12px ${glowColor}`,
        minHeight: "9rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.95)",
        transition: "opacity 0.3s ease, transform 0.3s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
      }}
    >
      {/* Host crown */}
      {player.isHost && (
        <div
          className="mb-1 text-xl leading-none"
          title="Host"
          style={{ textShadow: "0 0 8px #ffd700" }}
        >
          &#9813;
        </div>
      )}

      {/* Nickname */}
      <p
        className="text-center font-bold truncate w-full text-center mb-1"
        style={{
          ...retroFont,
          color: player.isReady ? "#00ff00" : "#f9fafb",
          fontSize: "0.65rem",
          textShadow: player.isReady ? "0 0 6px #00ff00" : "none",
        }}
      >
        {player.nickname}
      </p>

      {/* (you) label */}
      {isCurrentUser && (
        <p
          className="text-xs mb-1"
          style={{ ...retroFont, color: "#6b7280", fontSize: "0.5rem" }}
        >
          (you)
        </p>
      )}

      {/* Ready status label */}
      <p
        className="text-xs mb-2"
        style={{
          ...retroFont,
          color: player.isReady ? "#00ff00" : "#6b7280",
          fontSize: "0.5rem",
          letterSpacing: "0.1em",
        }}
      >
        {player.isReady ? "READY" : "NOT READY"}
      </p>

      {/* Toggle button — only for the current user */}
      {isCurrentUser && (
        <button
          onClick={onToggleReady}
          className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            ...retroFont,
            fontSize: "0.5rem",
            background: player.isReady
              ? "linear-gradient(135deg, #003300, #001a00)"
              : "linear-gradient(135deg, #0055aa, #002255)",
            color: player.isReady ? "#00ff00" : "#00aaff",
            border: `1px solid ${player.isReady ? "#00ff00" : "#00aaff"}`,
            boxShadow: player.isReady
              ? "0 0 6px rgba(0,255,0,0.4)"
              : "0 0 6px rgba(0,170,255,0.3)",
          }}
        >
          {player.isReady ? "Cancel" : "Ready!"}
        </button>
      )}
    </div>
  );
}
