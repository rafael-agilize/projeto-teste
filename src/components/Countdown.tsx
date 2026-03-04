"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  count: number;
  onComplete: () => void;
}

const retroFont = { fontFamily: "var(--font-retro)" };

export default function Countdown({ count, onComplete }: CountdownProps) {
  const [scale, setScale] = useState(0.5);
  const [opacity, setOpacity] = useState(0);

  // Trigger scale-in animation whenever count changes
  useEffect(() => {
    setScale(0.5);
    setOpacity(0);
    const t = setTimeout(() => {
      setScale(1.1);
      setOpacity(1);
    }, 30);
    const t2 = setTimeout(() => {
      setScale(1);
    }, 180);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [count]);

  // Call onComplete when count drops to 0
  useEffect(() => {
    if (count <= 0) {
      const t = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(t);
    }
  }, [count, onComplete]);

  const displayValue = count > 0 ? count : "GO!";
  const numberColor = count > 1 ? "#ff4444" : count === 1 ? "#ffaa00" : "#00ff00";

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.82)" }}
    >
      {/* Title */}
      <p
        className="mb-8 tracking-widest"
        style={{ ...retroFont, color: "#00ffff", fontSize: "0.6rem", letterSpacing: "0.3em" }}
      >
        STARTING IN
      </p>

      {/* Big countdown number */}
      <div
        style={{
          ...retroFont,
          fontSize: "10rem",
          fontWeight: "bold",
          color: numberColor,
          textShadow: `0 0 30px ${numberColor}, 0 0 60px ${numberColor}`,
          lineHeight: 1,
          transform: `scale(${scale})`,
          opacity,
          transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
          userSelect: "none",
        }}
      >
        {displayValue}
      </div>

      {/* Pulsing ring decoration */}
      <div
        className="mt-12 rounded-full animate-ping"
        style={{
          width: "6rem",
          height: "6rem",
          border: `3px solid ${numberColor}`,
          opacity: 0.3,
        }}
      />
    </div>
  );
}
