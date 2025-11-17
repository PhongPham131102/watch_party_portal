import {
  io,
  Socket,
  type ManagerOptions,
  type SocketOptions,
} from "socket.io-client";
import { SOCKET_BASE_URL } from "@/constants";

/**
 * Get access token from localStorage
 */
function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
}

/**
 * WebSocket Helper - Singleton Pattern
 * Đảm bảo chỉ có 1 connection duy nhất trong toàn bộ app
 */
class WebSocketHelper {
  public socket: Socket | undefined;
  private static instance: WebSocketHelper;

  constructor() {
    if (!WebSocketHelper.instance) {
      const accessToken = getAccessToken();

      // Main socket connection (default namespace)
      // Dùng cho: notifications, watch party events, real-time features
      this.socket = io(SOCKET_BASE_URL, {
        transports: ["websocket", "polling"],
        autoConnect: false,
        auth: { token: accessToken },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        ...({ maxHttpBufferSize: 1e8 } as Partial<
          ManagerOptions & SocketOptions
        >),
      });

      // Setup event listeners
      this.setupEventListeners();

      WebSocketHelper.instance = this;
    }

    return WebSocketHelper.instance;
  }

  /**
   * Setup common event listeners
   */
  private setupEventListeners(): void {
    // Main socket events
    if (this.socket) {
      this.socket.on("connect", () => {
        console.log("✅ WebSocket connected:", this.socket?.id);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("👋 WebSocket disconnected:", reason);
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ WebSocket connection error:", error);
      });

      this.socket.on("error", (error) => {
        console.error("❌ WebSocket error:", error);
      });
    }
  }

  /**
   * Update access token dynamically
   */
  setAccessToken(token: string): void {
    if (this.socket) {
      this.socket.auth = { token };
      // Reconnect if already connected
      if (this.socket.connected) {
        this.socket.disconnect();
        this.socket.connect();
      }
    }
  }

  /**
   * Connect socket
   */
  connect(): void {
    if (this.socket && !this.socket.connected) {
      console.log("🔌 Connecting WebSocket...");
      this.socket.connect();
    }
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket?.connected) {
      console.log("🔌 Disconnecting WebSocket...");
      this.socket.disconnect();
    }
  }

  /**
   * Join a room (useful for user-specific events)
   */
  joinRoom(roomId: string): void {
    if (this.socket?.connected) {
      console.log("📡 Joining room:", roomId);
      this.socket.emit("join", { roomId });
    }
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      console.log("👋 Leaving room:", roomId);
      this.socket.emit("leave", { roomId });
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
const socketHelper = new WebSocketHelper();

// Export singleton instance
export default socketHelper;

// Export convenient methods
export const socket = socketHelper.socket;
export const setAccessToken = socketHelper.setAccessToken.bind(socketHelper);
export const connectSocket = socketHelper.connect.bind(socketHelper);
export const disconnectSocket = socketHelper.disconnect.bind(socketHelper);
export const joinRoom = socketHelper.joinRoom.bind(socketHelper);
export const leaveRoom = socketHelper.leaveRoom.bind(socketHelper);
