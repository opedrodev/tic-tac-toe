export type Message = {
  roomId: string
  userId: string
  message: string
}

export type BoardProps = {
  turn: string
  socket: Socket
  innerRef: React.RefObject<HTMLDivElement>
  handleCellClick: (index: number) => void
}
