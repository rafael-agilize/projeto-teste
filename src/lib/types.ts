export interface Player {
  id: string; // socket.id
  nickname: string;
  isHost: boolean;
  isReady: boolean;
}

export interface Room {
  code: string; // 4 uppercase letters
  players: Player[];
  maxPlayers: 4;
  status: "waiting" | "countdown" | "playing";
  hostId: string; // socket.id of host
}

// Socket events
export interface ServerToClientEvents {
  "room:created": (data: { code: string }) => void;
  "room:joined": (data: { room: Room }) => void;
  "room:player-joined": (data: { player: Player }) => void;
  "room:player-left": (data: { playerId: string }) => void;
  "room:updated": (data: { room: Room }) => void;
  "room:error": (data: { message: string }) => void;
  "room:countdown": (data: { count: number }) => void;
  "room:game-start": () => void;
}

export interface ClientToServerEvents {
  "room:create": (data: { nickname: string }) => void;
  "room:join": (data: { code: string; nickname: string }) => void;
  "room:ready": (data: { ready: boolean }) => void;
  "room:start": () => void;
}
