import Player from "../SocketClasses/player";

export default interface PlayerDisconnected {
    disconnectPlayer: boolean;
    player : Player
}