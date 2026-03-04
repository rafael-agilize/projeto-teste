import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "./lib/types";
import {
  createRoom,
  joinRoom,
  leaveRoom,
  setPlayerReady,
  canStart,
  getRoomByPlayerId,
} from "./lib/room";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error handling request:", err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    }
  );

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle room creation
    socket.on("room:create", ({ nickname }) => {
      try {
        const room = createRoom(socket.id, nickname);
        socket.join(room.code);
        socket.emit("room:created", { code: room.code });
        socket.emit("room:joined", { room });
        console.log(`Room ${room.code} created by ${nickname} (${socket.id})`);
      } catch (err) {
        console.error("Error creating room:", err);
        socket.emit("room:error", { message: "Failed to create room" });
      }
    });

    // Handle room joining
    socket.on("room:join", ({ code, nickname }) => {
      try {
        const result = joinRoom(code, socket.id, nickname);
        if ("error" in result) {
          socket.emit("room:error", { message: result.error });
          return;
        }
        socket.join(code);
        socket.emit("room:joined", { room: result });
        // Notify other players in the room
        const newPlayer = result.players.find((p) => p.id === socket.id);
        if (newPlayer) {
          socket.to(code).emit("room:player-joined", { player: newPlayer });
          socket.to(code).emit("room:updated", { room: result });
        }
        console.log(`${nickname} (${socket.id}) joined room ${code}`);
      } catch (err) {
        console.error("Error joining room:", err);
        socket.emit("room:error", { message: "Failed to join room" });
      }
    });

    // Handle player ready toggle
    socket.on("room:ready", ({ ready }) => {
      try {
        const room = setPlayerReady(socket.id, ready);
        if (room) {
          io.to(room.code).emit("room:updated", { room });
        }
      } catch (err) {
        console.error("Error setting ready state:", err);
      }
    });

    // Handle game start (host only)
    socket.on("room:start", () => {
      try {
        const room = getRoomByPlayerId(socket.id);
        if (!room) return;
        if (room.hostId !== socket.id) {
          socket.emit("room:error", { message: "Only the host can start the game" });
          return;
        }
        if (!canStart(room.code)) {
          socket.emit("room:error", { message: "Need at least 2 ready players to start" });
          return;
        }

        room.status = "countdown";

        // Emit countdown sequence: 3, 2, 1
        let count = 3;
        const countdownInterval = setInterval(() => {
          io.to(room.code).emit("room:countdown", { count });
          count--;
          if (count < 0) {
            clearInterval(countdownInterval);
            room.status = "playing";
            io.to(room.code).emit("room:game-start");
          }
        }, 1000);
      } catch (err) {
        console.error("Error starting game:", err);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      try {
        const { room, deleted } = leaveRoom(socket.id);
        if (deleted || !room) return;

        io.to(room.code).emit("room:player-left", { playerId: socket.id });
        io.to(room.code).emit("room:updated", { room });
      } catch (err) {
        console.error("Error handling disconnect:", err);
      }
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
