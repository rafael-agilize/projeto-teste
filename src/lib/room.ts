import type { Room, Player } from "./types";

// In-memory room storage
const rooms = new Map<string, Room>();

// Map from socketId to roomCode for efficient lookup
const playerRoomMap = new Map<string, string>();

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let attempts = 0;
  while (attempts < 100) {
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (!rooms.has(code)) return code;
    attempts++;
  }
  throw new Error("Could not generate unique room code");
}

export function createRoom(socketId: string, nickname: string): Room {
  const code = generateCode();
  const host: Player = {
    id: socketId,
    nickname,
    isHost: true,
    isReady: false,
  };
  const room: Room = {
    code,
    players: [host],
    maxPlayers: 4,
    status: "waiting",
    hostId: socketId,
  };
  rooms.set(code, room);
  playerRoomMap.set(socketId, code);
  return room;
}

export function joinRoom(
  code: string,
  socketId: string,
  nickname: string
): Room | { error: string } {
  const room = rooms.get(code);
  if (!room) {
    return { error: "Room not found" };
  }

  // Player is already in the room (e.g. page reload or create-then-navigate flow)
  const existing = room.players.find((p) => p.id === socketId);
  if (existing) {
    return room;
  }

  if (room.players.length >= room.maxPlayers) {
    return { error: "Room is full" };
  }
  const player: Player = {
    id: socketId,
    nickname,
    isHost: false,
    isReady: false,
  };
  room.players.push(player);
  playerRoomMap.set(socketId, code);
  return room;
}

export function leaveRoom(socketId: string): {
  room: Room | null;
  deleted: boolean;
} {
  const code = playerRoomMap.get(socketId);
  if (!code) return { room: null, deleted: false };

  const room = rooms.get(code);
  if (!room) {
    playerRoomMap.delete(socketId);
    return { room: null, deleted: false };
  }

  // Remove the player
  room.players = room.players.filter((p) => p.id !== socketId);
  playerRoomMap.delete(socketId);

  // Room is empty — delete it
  if (room.players.length === 0) {
    rooms.delete(code);
    return { room: null, deleted: true };
  }

  // Transfer host if the host left
  if (room.hostId === socketId) {
    const newHost = room.players[0];
    newHost.isHost = true;
    room.hostId = newHost.id;
  }

  return { room, deleted: false };
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function setPlayerReady(
  socketId: string,
  ready: boolean
): Room | null {
  const code = playerRoomMap.get(socketId);
  if (!code) return null;
  const room = rooms.get(code);
  if (!room) return null;
  const player = room.players.find((p) => p.id === socketId);
  if (!player) return null;
  player.isReady = ready;
  return room;
}

export function canStart(code: string): boolean {
  const room = rooms.get(code);
  if (!room) return false;
  const readyCount = room.players.filter((p) => p.isReady).length;
  return readyCount >= 2;
}

export function getRoomByPlayerId(socketId: string): Room | undefined {
  const code = playerRoomMap.get(socketId);
  if (!code) return undefined;
  return rooms.get(code);
}
