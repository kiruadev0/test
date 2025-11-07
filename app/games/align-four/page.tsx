"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getConnect4AIMove, type Difficulty } from "@/lib/game-ai"
import { MultiplayerLobby } from "@/components/multiplayer-lobby"
import { MultiplayerManager } from "@/lib/multiplayer-manager"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/i18n"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

type GameMode = "menu" | "ai" | "local" | "online-lobby" | "online-waiting" | "online-playing"

export default function AlignFourPage() {
  const searchParams = useSearchParams()
  const roomParam = searchParams.get("room")

  const [mode, setMode] = useState<GameMode>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [board, setBoard] = useState<(number | null)[][]>(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [winner, setWinner] = useState<number | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)

  const [multiplayerManager] = useState(() => new MultiplayerManager())
  const [roomCode, setRoomCode] = useState<string>("")
  const [isHost, setIsHost] = useState(false)
  const [opponentJoined, setOpponentJoined] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const { language } = useLanguage()
  const t = translations[language]

  const checkWinner = (board: (number | null)[][]): number | null => {
    const rows = board.length
    const cols = board[0].length

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols - 3; col++) {
        const val = board[row][col]
        if (val && val === board[row][col + 1] && val === board[row][col + 2] && val === board[row][col + 3]) {
          return val
        }
      }
    }

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows - 3; row++) {
        const val = board[row][col]
        if (val && val === board[row + 1][col] && val === board[row + 2][col] && val === board[row + 3][col]) {
          return val
        }
      }
    }

    for (let row = 0; row < rows - 3; row++) {
      for (let col = 0; col < cols - 3; col++) {
        const val = board[row][col]
        if (
          val &&
          val === board[row + 1][col + 1] &&
          val === board[row + 2][col + 2] &&
          val === board[row + 3][col + 3]
        ) {
          return val
        }
      }
    }

    for (let row = 0; row < rows - 3; row++) {
      for (let col = 3; col < cols; col++) {
        const val = board[row][col]
        if (
          val &&
          val === board[row + 1][col - 1] &&
          val === board[row + 2][col - 2] &&
          val === board[row + 3][col - 3]
        ) {
          return val
        }
      }
    }

    return null
  }

  const createOnlineRoom = async () => {
    try {
      const initialState = {
        board: Array(6)
          .fill(null)
          .map(() => Array(7).fill(null)),
        currentPlayer: 1,
        winner: null,
      }
      const code = await multiplayerManager.createRoom("align-four", initialState)
      setRoomCode(code)
      setIsHost(true)
      setMode("online-waiting")

      multiplayerManager.subscribeToRoom(code, (gameState) => {
        console.log("[v0] Game state updated:", gameState)
        setBoard(gameState.board)
        setCurrentPlayer(gameState.currentPlayer)
        setWinner(gameState.winner)
      })

      // Check if opponent joined
      const checkOpponent = setInterval(async () => {
        const room = await multiplayerManager.getRoom(code)
        if (room && room.guest_id) {
          setOpponentJoined(true)
          setMode("online-playing")
          clearInterval(checkOpponent)
        }
      }, 1000)
    } catch (error) {
      console.error("[v0] Error creating room:", error)
      alert("Failed to create room. Please try again.")
    }
  }

  const joinOnlineRoom = async (code: string) => {
    try {
      const success = await multiplayerManager.joinRoom(code)
      if (success) {
        setRoomCode(code)
        setIsHost(false)
        setOpponentJoined(true)
        setMode("online-playing")

        const room = await multiplayerManager.getRoom(code)
        if (room) {
          setBoard(room.game_state.board)
          setCurrentPlayer(room.game_state.currentPlayer)
          setWinner(room.game_state.winner)
        }

        multiplayerManager.subscribeToRoom(code, (gameState) => {
          console.log("[v0] Game state updated:", gameState)
          setBoard(gameState.board)
          setCurrentPlayer(gameState.currentPlayer)
          setWinner(gameState.winner)
        })
      } else {
        alert("Failed to join room. Please check the code and try again.")
      }
    } catch (error) {
      console.error("[v0] Error joining room:", error)
      alert("Failed to join room. Please try again.")
    }
  }

  const dropDisc = async (col: number) => {
    if (winner || isAIThinking) return

    if (mode === "online-playing") {
      const room = await multiplayerManager.getRoom(roomCode)
      if (!room) return

      const isPlayerTurn = (isHost && currentPlayer === 1) || (!isHost && currentPlayer === 2)
      if (!isPlayerTurn) return
    }

    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = board.map((r) => [...r])
        newBoard[row][col] = currentPlayer
        setBoard(newBoard)

        const gameWinner = checkWinner(newBoard)
        const nextPlayer = currentPlayer === 1 ? 2 : 1

        if (gameWinner) {
          setWinner(gameWinner)
        } else {
          setCurrentPlayer(nextPlayer)
        }

        if (mode === "online-playing") {
          await multiplayerManager.updateGameState(roomCode, {
            board: newBoard,
            currentPlayer: nextPlayer,
            winner: gameWinner,
          })
        }

        return
      }
    }
  }

  useEffect(() => {
    if (roomParam && mode === "menu") {
      setMode("online-lobby")
      setTimeout(() => joinOnlineRoom(roomParam), 100)
    }
  }, [roomParam])

  useEffect(() => {
    if (mode === "ai" && currentPlayer === 2 && !winner) {
      setIsAIThinking(true)
      setTimeout(() => {
        const aiMove = getConnect4AIMove(board, difficulty)
        dropDisc(aiMove)
        setIsAIThinking(false)
      }, 500)
    }
  }, [currentPlayer, mode, winner])

  const resetGame = () => {
    setBoard(
      Array(6)
        .fill(null)
        .map(() => Array(7).fill(null)),
    )
    setCurrentPlayer(1)
    setWinner(null)
    setIsAIThinking(false)
  }

  const startGame = (selectedMode: GameMode, selectedDifficulty?: Difficulty) => {
    setMode(selectedMode)
    if (selectedDifficulty) setDifficulty(selectedDifficulty)
    resetGame()
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(`${window.location.origin}/games/align-four?room=${roomCode}`)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  if (mode === "online-lobby") {
    return (
      <MultiplayerLobby onCreateRoom={createOnlineRoom} onJoinRoom={joinOnlineRoom} onBack={() => setMode("menu")} />
    )
  }

  if (mode === "online-waiting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t.alignFour}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">{t.roomCode}</p>
              <div className="text-4xl font-bold tracking-wider mb-4">{roomCode}</div>
              <Button onClick={copyRoomCode} variant="outline" className="w-full bg-transparent">
                {copiedCode ? t.codeCopied : t.copyCode}
              </Button>
            </div>
            <div className="text-center">
              <p className="text-lg">{t.waitingForOpponent}</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
            <Button
              onClick={() => {
                multiplayerManager.unsubscribe()
                setMode("menu")
              }}
              variant="ghost"
              className="w-full"
            >
              {t.back}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{t.alignFour}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.aiDifficulty}</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">{t.easy}</SelectItem>
                  <SelectItem value="medium">{t.medium}</SelectItem>
                  <SelectItem value="hard">{t.hard}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => startGame("ai", difficulty)}>
              {t.playVsAI}
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => startGame("local")}>
              {t.localMultiplayer}
            </Button>
            <Button className="w-full bg-transparent" variant="outline" onClick={() => setMode("online-lobby")}>
              {t.onlineMultiplayer}
            </Button>
            <Link href="/">
              <Button className="w-full" variant="ghost">
                {t.backToGames}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getTurnText = () => {
    if (winner) {
      if (mode === "online-playing") {
        const playerWon = (isHost && winner === 1) || (!isHost && winner === 2)
        return playerWon ? t.youWin : t.playerWins.replace("{player}", "2")
      }
      return t.playerWins.replace("{player}", String(winner))
    }

    if (isAIThinking) return t.aiTurn

    if (mode === "online-playing") {
      const isPlayerTurn = (isHost && currentPlayer === 1) || (!isHost && currentPlayer === 2)
      return isPlayerTurn ? t.yourMove : t.opponentMove
    }

    return t.playerTurn.replace("{player}", String(currentPlayer))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{t.alignFour}</CardTitle>
            <Button
              variant="ghost"
              onClick={() => {
                if (mode === "online-playing") {
                  multiplayerManager.unsubscribe()
                }
                setMode("menu")
              }}
            >
              {t.menu}
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-lg font-semibold">{getTurnText()}</p>
            {mode === "online-playing" && (
              <p className="text-sm text-muted-foreground mt-1">
                {t.roomCode}: {roomCode}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-600 p-4 rounded-lg shadow-2xl">
            <div className="grid grid-cols-7 gap-2">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => dropDisc(colIndex)}
                    disabled={
                      winner !== null ||
                      isAIThinking ||
                      (mode === "online-playing" &&
                        ((isHost && currentPlayer !== 1) || (!isHost && currentPlayer !== 2)))
                    }
                    className="aspect-square rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors disabled:cursor-not-allowed shadow-inner"
                  >
                    {cell === 1 && <div className="w-4/5 h-4/5 rounded-full bg-red-500 shadow-lg" />}
                    {cell === 2 && <div className="w-4/5 h-4/5 rounded-full bg-yellow-400 shadow-lg" />}
                  </button>
                )),
              )}
            </div>
          </div>
          {winner && (
            <Button
              className="w-full mt-4"
              onClick={async () => {
                resetGame()
                if (mode === "online-playing") {
                  await multiplayerManager.updateGameState(roomCode, {
                    board: Array(6)
                      .fill(null)
                      .map(() => Array(7).fill(null)),
                    currentPlayer: 1,
                    winner: null,
                  })
                }
              }}
            >
              {t.playAgain}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
