"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Board = (number | null)[][]

const GRID_SIZE = 4

export default function NumberMergePage() {
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  function createEmptyBoard(): Board {
    return Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null))
  }

  function addRandomTile(board: Board): Board {
    const emptyCells: [number, number][] = []
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === null) emptyCells.push([i, j])
      })
    })

    if (emptyCells.length === 0) return board

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4
    return newBoard
  }

  function initGame() {
    let newBoard = createEmptyBoard()
    newBoard = addRandomTile(newBoard)
    newBoard = addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  useEffect(() => {
    initGame()
  }, [])

  function moveLeft(board: Board): { board: Board; moved: boolean; scoreGained: number } {
    let moved = false
    let scoreGained = 0
    const newBoard = board.map((row) => {
      const filtered = row.filter((cell) => cell !== null) as number[]
      const merged: number[] = []
      let i = 0

      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i] * 2
          merged.push(mergedValue)
          scoreGained += mergedValue
          if (mergedValue === 4096) setWon(true)
          i += 2
          moved = true
        } else {
          merged.push(filtered[i])
          i++
        }
      }

      while (merged.length < GRID_SIZE) {
        merged.push(null as any)
      }

      if (JSON.stringify(merged) !== JSON.stringify(row)) {
        moved = true
      }

      return merged
    })

    return { board: newBoard, moved, scoreGained }
  }

  function rotateBoard(board: Board): Board {
    const newBoard = createEmptyBoard()
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newBoard[j][GRID_SIZE - 1 - i] = board[i][j]
      }
    }
    return newBoard
  }

  function move(direction: "left" | "right" | "up" | "down") {
    if (gameOver) return

    let currentBoard = board
    let rotations = 0

    if (direction === "right") rotations = 2
    else if (direction === "up") rotations = 3
    else if (direction === "down") rotations = 1

    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard)
    }

    const { board: movedBoard, moved, scoreGained } = moveLeft(currentBoard)

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateBoard(movedBoard)
    }

    if (moved) {
      const newBoard = addRandomTile(currentBoard)
      setBoard(newBoard)
      setScore((prev) => prev + scoreGained)

      if (!canMove(newBoard)) {
        setGameOver(true)
      }
    }
  }

  function canMove(board: Board): boolean {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === null) return true
        if (j < GRID_SIZE - 1 && board[i][j] === board[i][j + 1]) return true
        if (i < GRID_SIZE - 1 && board[i][j] === board[i + 1][j]) return true
      }
    }
    return false
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        const direction = e.key.replace("Arrow", "").toLowerCase() as "left" | "right" | "up" | "down"
        move(direction)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [board, gameOver])

  const getTileColor = (value: number | null): string => {
    if (!value) return "bg-gray-200"
    const colors: { [key: number]: string } = {
      2: "bg-amber-100 text-amber-900",
      4: "bg-amber-200 text-amber-900",
      8: "bg-orange-300 text-white",
      16: "bg-orange-400 text-white",
      32: "bg-orange-500 text-white",
      64: "bg-red-400 text-white",
      128: "bg-red-500 text-white",
      256: "bg-red-600 text-white",
      512: "bg-yellow-400 text-white",
      1024: "bg-yellow-500 text-white",
      2048: "bg-yellow-600 text-white",
      4096: "bg-purple-600 text-white",
    }
    return colors[value] || "bg-purple-700 text-white"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Number Merge</CardTitle>
            <Link href="/">
              <Button variant="ghost">Menu</Button>
            </Link>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-lg font-semibold">Score: {score}</div>
            <Button onClick={initGame} variant="secondary">
              New Game
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {won && !gameOver && (
            <div className="bg-green-500 text-white p-4 rounded-lg text-center font-bold">
              You reached 4096! Keep going!
            </div>
          )}
          {gameOver && (
            <div className="bg-red-500 text-white p-4 rounded-lg text-center font-bold">
              Game Over! Final Score: {score}
            </div>
          )}

          <div className="bg-amber-700 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-3">
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${getTileColor(cell)}`}
                  >
                    {cell}
                  </div>
                )),
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div />
            <Button onClick={() => move("up")} variant="secondary" className="aspect-square text-2xl">
              ↑
            </Button>
            <div />
            <Button onClick={() => move("left")} variant="secondary" className="aspect-square text-2xl">
              ←
            </Button>
            <Button onClick={() => move("down")} variant="secondary" className="aspect-square text-2xl">
              ↓
            </Button>
            <Button onClick={() => move("right")} variant="secondary" className="aspect-square text-2xl">
              →
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">Use arrow keys or buttons to play</p>
        </CardContent>
      </Card>
    </div>
  )
}
