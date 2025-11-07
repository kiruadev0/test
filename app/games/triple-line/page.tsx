"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTicTacToeAIMove, type Difficulty } from "@/lib/game-ai"
import Link from "next/link"

type GameMode = "menu" | "ai" | "local" | "online"

export default function TicTacToePage() {
  const [mode, setMode] = useState<GameMode>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<string | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)

  const checkWinner = (board: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "draw"
    }

    return null
  }

  const makeMove = (index: number) => {
    if (board[index] || winner || isAIThinking) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  useEffect(() => {
    if (mode === "ai" && currentPlayer === "O" && !winner) {
      setIsAIThinking(true)
      setTimeout(() => {
        const aiMove = getTicTacToeAIMove(board, difficulty)
        makeMove(aiMove)
        setIsAIThinking(false)
      }, 500)
    }
  }, [currentPlayer, mode, winner])

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setIsAIThinking(false)
  }

  const startGame = (selectedMode: GameMode, selectedDifficulty?: Difficulty) => {
    setMode(selectedMode)
    if (selectedDifficulty) setDifficulty(selectedDifficulty)
    resetGame()
  }

  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Tic-Tac-Toe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Difficulty</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard (Unbeatable)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => startGame("ai", difficulty)}>
              Play vs AI
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => startGame("local")}>
              Local Multiplayer
            </Button>
            <Button className="w-full bg-transparent" variant="outline" onClick={() => startGame("online")}>
              Online Multiplayer (Coming Soon)
            </Button>
            <Link href="/games">
              <Button className="w-full" variant="ghost">
                Back to Games
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Tic-Tac-Toe</CardTitle>
            <Button variant="ghost" onClick={() => setMode("menu")}>
              Menu
            </Button>
          </div>
          <div className="text-center mt-2">
            {winner ? (
              <p className="text-xl font-bold">
                {winner === "draw"
                  ? "It's a Draw!"
                  : mode === "ai"
                    ? winner === "X"
                      ? "You Win!"
                      : "AI Wins!"
                    : `${winner} Wins!`}
              </p>
            ) : (
              <p className="text-lg">
                {isAIThinking
                  ? "AI is thinking..."
                  : mode === "ai"
                    ? currentPlayer === "X"
                      ? "Your Turn (X)"
                      : "AI's Turn (O)"
                    : `Player ${currentPlayer}'s Turn`}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => makeMove(index)}
                disabled={cell !== null || winner !== null || isAIThinking}
                className="aspect-square bg-white rounded-lg border-4 border-green-600 hover:bg-green-50 disabled:cursor-not-allowed flex items-center justify-center text-5xl font-bold transition-colors"
              >
                {cell === "X" && <span className="text-blue-600">X</span>}
                {cell === "O" && <span className="text-red-600">O</span>}
              </button>
            ))}
          </div>
          {winner && (
            <Button className="w-full" onClick={resetGame}>
              Play Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
