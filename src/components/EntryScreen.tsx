"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateNickname, saveNickname, loadNickname } from "@/lib/nickname";
import { getSocket } from "@/lib/socket";

export default function EntryScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [mode, setMode] = useState<"idle" | "joining">("idle");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load saved nickname on mount
  useEffect(() => {
    const saved = loadNickname();
    if (saved) {
      setNickname(saved);
    }
  }, []);

  const validation = validateNickname(nickname);
  const isNicknameValid = validation.valid;

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
    if (touched) {
      const result = validateNickname(e.target.value);
      setError(result.valid ? "" : (result.error ?? ""));
    }
  }

  function handleNicknameBlur() {
    setTouched(true);
    const result = validateNickname(nickname);
    setError(result.valid ? "" : (result.error ?? ""));
  }

  function handleCreateRoom() {
    if (!isNicknameValid) {
      setTouched(true);
      setError(validation.error ?? "Invalid nickname");
      return;
    }
    saveNickname(nickname);
    setIsCreating(true);

    const socket = getSocket();

    // Listen for room:created to get the code, then navigate
    socket.once("room:created", ({ code }) => {
      setIsCreating(false);
      router.push(`/room/${code}?create=true`);
    });

    socket.once("room:error", ({ message }) => {
      setIsCreating(false);
      setError(message);
    });

    socket.emit("room:create", { nickname });
  }

  function handleJoinModeToggle() {
    if (!isNicknameValid) {
      setTouched(true);
      setError(validation.error ?? "Invalid nickname");
      return;
    }
    setMode(mode === "joining" ? "idle" : "joining");
    setJoinCode("");
  }

  function handleJoinCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
    setJoinCode(val);
  }

  function handleJoinSubmit() {
    if (!isNicknameValid) {
      setTouched(true);
      setError(validation.error ?? "Invalid nickname");
      return;
    }
    if (joinCode.length !== 4) return;
    saveNickname(nickname);
    router.push(`/room/${joinCode}`);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <h1
            className="text-2xl md:text-3xl font-bold tracking-widest mb-2"
            style={{
              fontFamily: "var(--font-retro)",
              color: "#00ffff",
              textShadow:
                "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00a0a0",
            }}
          >
            TETRIS
          </h1>
          <h2
            className="text-lg md:text-xl font-bold tracking-widest"
            style={{
              fontFamily: "var(--font-retro)",
              color: "#ff00ff",
              textShadow:
                "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #a000a0",
            }}
          >
            BATTLE
          </h2>
        </div>

        {/* Card */}
        <div
          className="rounded-lg p-6 md:p-8"
          style={{
            background: "rgba(17, 24, 39, 0.9)",
            border: "2px solid #00ffff",
            boxShadow: "0 0 20px rgba(0,255,255,0.2), inset 0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Nickname Input */}
          <div className="mb-6">
            <label
              htmlFor="nickname"
              className="block text-xs mb-2 uppercase tracking-widest"
              style={{ fontFamily: "var(--font-retro)", color: "#9ca3af" }}
            >
              Your Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              onBlur={handleNicknameBlur}
              maxLength={12}
              placeholder="Enter name..."
              className="w-full px-4 py-3 rounded text-sm outline-none transition-all"
              style={{
                fontFamily: "var(--font-retro)",
                background: "#1f2937",
                border: `2px solid ${error && touched ? "#ff4444" : "#374151"}`,
                color: "#f9fafb",
                fontSize: "0.75rem",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = error && touched ? "#ff4444" : "#00ffff";
              }}
              onBlurCapture={(e) => {
                e.target.style.borderColor = error && touched ? "#ff4444" : "#374151";
              }}
            />
            {touched && error && (
              <p
                className="mt-1 text-xs"
                style={{ fontFamily: "var(--font-retro)", color: "#ff4444", fontSize: "0.6rem" }}
              >
                {error}
              </p>
            )}
            {!error && nickname && (
              <p
                className="mt-1 text-xs"
                style={{ fontFamily: "var(--font-retro)", color: "#00ff00", fontSize: "0.6rem" }}
              >
                {nickname.trim().length}/12
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleCreateRoom}
              disabled={!isNicknameValid || isCreating}
              className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded transition-all"
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "0.6rem",
                background: isNicknameValid && !isCreating
                  ? "linear-gradient(135deg, #00cc00, #006600)"
                  : "#1f2937",
                color: isNicknameValid && !isCreating ? "#ffffff" : "#4b5563",
                border: `2px solid ${isNicknameValid && !isCreating ? "#00ff00" : "#374151"}`,
                boxShadow: isNicknameValid && !isCreating
                  ? "0 0 10px rgba(0,255,0,0.4)"
                  : "none",
                cursor: isNicknameValid && !isCreating ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (isNicknameValid && !isCreating) {
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "0 0 20px rgba(0,255,0,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (isNicknameValid && !isCreating) {
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "0 0 10px rgba(0,255,0,0.4)";
                }
              }}
            >
              {isCreating ? "CREATING..." : "CREATE ROOM"}
            </button>

            <button
              onClick={handleJoinModeToggle}
              disabled={!isNicknameValid || isCreating}
              className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider rounded transition-all"
              style={{
                fontFamily: "var(--font-retro)",
                fontSize: "0.6rem",
                background:
                  mode === "joining"
                    ? "linear-gradient(135deg, #cc00cc, #660066)"
                    : isNicknameValid && !isCreating
                    ? "linear-gradient(135deg, #0088cc, #004488)"
                    : "#1f2937",
                color: isNicknameValid && !isCreating ? "#ffffff" : "#4b5563",
                border: `2px solid ${
                  mode === "joining"
                    ? "#ff00ff"
                    : isNicknameValid && !isCreating
                    ? "#00aaff"
                    : "#374151"
                }`,
                boxShadow:
                  mode === "joining"
                    ? "0 0 10px rgba(255,0,255,0.4)"
                    : isNicknameValid && !isCreating
                    ? "0 0 10px rgba(0,170,255,0.4)"
                    : "none",
                cursor: isNicknameValid && !isCreating ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (isNicknameValid && !isCreating) {
                  (e.target as HTMLButtonElement).style.boxShadow =
                    mode === "joining"
                      ? "0 0 20px rgba(255,0,255,0.8)"
                      : "0 0 20px rgba(0,170,255,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (isNicknameValid && !isCreating) {
                  (e.target as HTMLButtonElement).style.boxShadow =
                    mode === "joining"
                      ? "0 0 10px rgba(255,0,255,0.4)"
                      : "0 0 10px rgba(0,170,255,0.4)";
                }
              }}
            >
              JOIN ROOM
            </button>
          </div>

          {/* Join Code Input Panel */}
          {mode === "joining" && (
            <div
              className="mt-4 p-4 rounded"
              style={{
                background: "#111827",
                border: "2px solid #ff00ff",
                boxShadow: "0 0 10px rgba(255,0,255,0.2)",
              }}
            >
              <label
                htmlFor="joinCode"
                className="block text-xs mb-2 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-retro)", color: "#9ca3af", fontSize: "0.6rem" }}
              >
                Room Code
              </label>
              <div className="flex gap-2">
                <input
                  id="joinCode"
                  type="text"
                  value={joinCode}
                  onChange={handleJoinCodeChange}
                  maxLength={4}
                  placeholder="ABCD"
                  className="flex-1 px-4 py-2 rounded text-center text-lg font-bold tracking-widest outline-none"
                  style={{
                    fontFamily: "var(--font-retro)",
                    background: "#1f2937",
                    border: "2px solid #374151",
                    color: "#ff00ff",
                    fontSize: "1rem",
                    letterSpacing: "0.4em",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#ff00ff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#374151";
                  }}
                />
                <button
                  onClick={handleJoinSubmit}
                  disabled={joinCode.length !== 4}
                  className="px-4 py-2 text-xs font-bold rounded uppercase tracking-wider transition-all"
                  style={{
                    fontFamily: "var(--font-retro)",
                    fontSize: "0.6rem",
                    background:
                      joinCode.length === 4
                        ? "linear-gradient(135deg, #cc00cc, #660066)"
                        : "#1f2937",
                    color: joinCode.length === 4 ? "#ffffff" : "#4b5563",
                    border: `2px solid ${joinCode.length === 4 ? "#ff00ff" : "#374151"}`,
                    boxShadow:
                      joinCode.length === 4
                        ? "0 0 10px rgba(255,0,255,0.4)"
                        : "none",
                    cursor: joinCode.length === 4 ? "pointer" : "not-allowed",
                  }}
                >
                  JOIN
                </button>
              </div>
              <p
                className="mt-2 text-xs text-center"
                style={{ fontFamily: "var(--font-retro)", color: "#6b7280", fontSize: "0.55rem" }}
              >
                Enter the 4-letter room code
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p
          className="text-center mt-6 text-xs"
          style={{ fontFamily: "var(--font-retro)", color: "#4b5563", fontSize: "0.55rem" }}
        >
          Up to 4 players · Last one standing wins
        </p>
      </div>
    </div>
  );
}
