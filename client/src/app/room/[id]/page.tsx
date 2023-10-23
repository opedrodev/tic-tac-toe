/* eslint-disable @typescript-eslint/no-non-null-assertion */

'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useSocket from '@/hooks/useSocket'
import { Message } from '@/types'
import Chat from '@/components/Chat'
import Board from '@/components/Board'

export default function Room() {
    const socket = useSocket()
    const { id } = useParams<{ id: string }>()

    const [users, setUsers] = useState<string[]>([])
    const [turn, setTurn] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [playerWon, setPlayerWon] = useState<string>('')
    const [canPlay, setCanPlay] = useState<boolean>(true)
    const sectionRef = useRef<HTMLDivElement>(null)

    function handleCellClick(cell: number) {
        if (!canPlay) return
        if (turn !== socket.id) return

        const board = sectionRef.current?.childNodes
        if (!board) return

        if (board[cell].childNodes[0].textContent) return

        board[cell].childNodes[0].textContent = users[0] === socket.id ? 'O' : 'X'

        const combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [0, 4, 8],
            [2, 5, 8],
            [2, 4, 6],
        ]

        const playerX: number[] = []
        const playerO: number[] = []

        board!.forEach((e, i) => {
            if (e.textContent === 'X') playerX.push(i)
            if (e.textContent === 'O') playerO.push(i)
        })

        combinations.forEach(([i, j, k]) => {
            if (playerX.includes(i) && playerX.includes(j) && playerX.includes(k)) {
                socket.emit('player-won', { roomId: id, userId: socket.id })
            }

            if (playerO.includes(i) && playerO.includes(j) && playerO.includes(k)) {
                socket.emit('player-won', { roomId: id, userId: socket.id })
            }

            if (playerX.length === 5) {
                console.log('draw')
            }
        })

        const cells = Array.from(board).map((e) => e.textContent)

        socket.emit('cell-click', {
            roomId: id, userId: socket.id, cells, turn: users.find((user) => user !== socket.id),
        })
    }

    function updateBoard(board: string[]) {
        if (!sectionRef.current) return
        const cells = Array.from(sectionRef.current!.childNodes)
        cells.forEach((e, i) => {
            e.childNodes[0].textContent = board[i]
        })
    }

    useEffect(() => {
        socket.on('connect', () => {
            setUsers((users) => [...users, socket.id])
            socket.emit('join-room', { roomId: id, userId: socket.id })

            if (users.length === 2) {
                setCanPlay(false)
            }
        })

        socket.on('user-connected', (id: string, room: string[]) => {
            setUsers(room)
            setTurn(id)
        })

        socket.on('user-disconnected', (id, room: string[]) => {
            setUsers(room)
        })

        socket.on('receive-message', ({ roomId, userId, message }: Message) => {
            setMessages((messages) => [...messages, { roomId, userId, message }])
        })

        socket.on('cell-clicked', ({ cells, turn: t }: { roomId: string, userId: string, cells: string[], turn: string }) => {
            updateBoard(cells)
            setTurn(t)
        })

        socket.on('player-won', (id: string) => {
            console.log(id)
            setPlayerWon(id)
        })

        return () => {
            socket.off('user-connected')
            socket.off('user-disconnected')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main className='grid grid-cols-[400px,1fr] h-screen'>
            <Chat messages={ messages } socket={ socket } />

            {
                playerWon ? (
                    <div className='self-center place-self-center'>
                        <h1 className='font-bold text-4xl'>
                            { playerWon === socket.id ? 'You' : 'Opponent' }
                            &nbsp;won
                        </h1>
                    </div>
                ) : (
                    <Board
                        socket={ socket }
                        turn={ turn }
                        innerRef={ sectionRef }
                        handleCellClick={ handleCellClick }
                    />
                )
            }

        </main>
    )
}
