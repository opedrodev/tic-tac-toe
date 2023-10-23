import { JoinRoomPayload, SocketIO } from '../types'
import Events from './Events'

export function JoinRoom({ io, socket }: SocketIO, { rooms, roomId, userId }: JoinRoomPayload) {
    if (!rooms[roomId]) {
        rooms[roomId] = []
    }

    rooms[roomId].push(userId)

    socket.join(roomId)
    io.to(roomId).emit(Events.USER_CONNECTED, userId, rooms[roomId])

    socket.on('disconnect', () => {
        rooms[roomId] = rooms[roomId].filter((id) => id !== userId)
        io.to(roomId).emit(Events.USER_DISCONNECTED, userId, rooms[roomId])
    })
}
