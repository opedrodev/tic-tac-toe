import { Server, Socket } from 'socket.io'

export type JoinRoomPayload = {
    rooms: Record<string, string[]>
    roomId: string
    userId: string
}

export type SocketIO = {
    io: Server
    socket: Socket
}
