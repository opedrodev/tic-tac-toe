import { useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'

export default function useSocket() {
    const socket = useMemo(() => io(process.env.WS_SERVER_URL as string, {
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
