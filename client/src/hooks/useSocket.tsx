import { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'

export default function useSocket() {
    const socket = useMemo(() => io('https://tic-tac-toe-production-6179.up.railway.app', {
        transports: ['websocket'],
    }), [])

    useEffect(() => {
        socket.connect()

        return () => {
            socket.disconnect()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return socket
}
