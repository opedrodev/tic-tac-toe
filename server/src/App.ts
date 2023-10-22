import express, { Application } from 'express'
import { Server } from 'socket.io'
import http from 'http'

export default class App {
    public server: http.Server

    private readonly app: Application

    private readonly io: Server

    private rooms: Record<string, string[]> = {}

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server, {
            cors: {
                origin: '*',
                methods: ['GET'],
            },
        })

        this.middlewares()
        this.listeners()
        this.routes()
    }

    private middlewares() {
        this.app.use(express.json())
    }

    private listeners() {
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} connected.`)

            socket.on('join-room', ({ roomId, userId }: { roomId: string, userId: string }) => {
                if (!this.rooms[roomId]) {
                    this.rooms[roomId] = []
                }

                this.rooms[roomId].push(userId)

                socket.join(roomId)
                this.io.to(roomId).emit('user-connected', userId, this.rooms[roomId])

                socket.on('player-won', ({ roomId, userId }: { roomId: string, userId: string }) => {
                    this.io.to(roomId).emit('player-won', userId)
                })

                socket.on('disconnect', () => {
                    this.rooms[roomId] = this.rooms[roomId].filter((id) => id !== userId)
                    this.io.to(roomId).emit('user-disconnected', userId, this.rooms[roomId])
                })
            })

            socket.on('cell-click', ({
                roomId, userId, cells, turn,
            }: { roomId: string, userId: string, cells: string[], turn: 'X' | 'O' }) => {
                console.log(turn)
                this.io.to(roomId).emit('cell-clicked', {
                    roomId, userId, cells, turn,
                })
            })

            socket.on('send-message', ({ roomId, userId, message }: { roomId: string, userId: string, message: string }) => {
                console.log(`User ${userId} sent message: ${message}`)
                this.io.to(roomId).emit('receive-message', { roomId, userId, message })
            })

            socket.on('disconnect', () => {
                console.log(`User ${socket.id} disconnected.`)
            })
        })
    }

    private routes() {
        this.app.get('/health', (req, res) => {
            res.status(200).json({ message: 'OK' })
        })
    }
}
