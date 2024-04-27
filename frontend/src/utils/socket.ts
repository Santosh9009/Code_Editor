import { io } from "socket.io-client";

interface SocketOptions {
  forceNewConnection?: boolean;
  reconnectionAttempts?: number;
  timeout?: number;
  transports?: string[];
}

const key: string = import.meta.env.VITE_BACKEND_URL;

export const initSocket = async () => {
  const options: SocketOptions = {
    forceNewConnection: true,
    reconnectionAttempts: Infinity,
    timeout: 1000,
    transports: ["websocket"],
  };
  return io(key, options);
};
