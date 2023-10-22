import express, { Application } from 'express'
import { Server } from 'socket.io'
import http from 'http'

export default class App {
    public server: http.Server

    private readonly app: Application

    private readonly io: Server

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server, {
            cors: {
                origin: 'http://localhost:3000',
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
