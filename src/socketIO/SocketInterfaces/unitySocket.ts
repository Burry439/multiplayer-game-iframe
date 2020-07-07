import { Socket } from "socket.io";

export default interface UnitySocket {
    playerId: string;
    socket : Socket
}