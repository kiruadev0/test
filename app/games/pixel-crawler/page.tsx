"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSnakeAIDirection, type Difficulty } from "@/lib/game-ai"
import { SnakeHead, SnakeBody, SnakeFood } from "@/components/game-assets/snake-assets"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/i18n"
import Link from "next/link"

type GameMode = "menu" | "ai" | "local" | "online"
type Position = { x: number; y: number }

const GRID_SIZE = 20
const INITIAL_SPEED = 150

export default function SnakePage() {
  const { language } = useLanguage()
  const t = translations[language]

  const [mode, setMode] = useState<GameMode>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<string>("right")
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const generateFood = useCallback((snakeBody: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }]
    setSnake(initialSnake)
    setFood(generateFood(initialSnake))
    setDirection("right")
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
  }

  const startGame = (selectedMode: GameMode, selectedDifficulty?: Difficulty) => {
    setMode(selectedMode)
    if (selectedDifficulty) setDifficulty(selectedDifficulty)
    resetGame()
  }

  useEffect(() => {
    if (mode === "menu" || gameOver || isPaused) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0]
        let newHead: Position

        let currentDirection = direction
        if (mode === "ai") {
          currentDirection = getSnakeAIDirection(prevSnake, food, GRID_SIZE, direction, difficulty)
          setDirection(currentDirection)
        }

        switch (currentDirection) {
          case "up":
            newHead = { x: head.x, y: head.y - 1 }
            break
          case "down":
            newHead = { x: head.x, y: head.y + 1 }
            break
          case "left":
            newHead = { x: head.x - 1, y: head.y }
            break
          case "right":
            newHead = { x: head.x + 1, y: head.y }
            break
          default:
            newHead = head
        }

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true)
          return prevSnake
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => prev + 10)
          setFood(generateFood(newSnake))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const gameLoop = setInterval(moveSnake, INITIAL_SPEED)
    return () => clearInterval(gameLoop)
  }, [mode, direction, food, gameOver, isPaused, difficulty, generateFood])

  useEffect(() => {
    if (mode === "menu" || mode === "ai") return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setIsPaused((prev) => !prev)
        return
      }

      const newDirection = (() => {
        switch (e.key) {
          case "ArrowUp":
            return direction !== "down" ? "up" : direction
          case "ArrowDown":
            return direction !== "up" ? "down" : direction
          case "ArrowLeft":
            return direction !== "right" ? "left" : direction
          case "ArrowRight":
            return direction !== "left" ? "right" : direction
          default:
            return direction
        }
      })()

      setDirection(newDirection)
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, mode])

  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-500 via-emerald-500 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">{t.pixelCrawler}</CardTitle>
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
              {t.watchAI}
            </Button>
            <Button className="w-full" variant="secondary" onClick={() => startGame("local")}>
              {t.playYourself}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-500 via-emerald-500 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{t.pixelCrawler}</CardTitle>
            <div className="flex gap-2">
              {mode === "local" && (
                <Button variant="secondary" onClick={() => setIsPaused(!isPaused)}>
                  {isPaused ? t.resume : t.pause}
                </Button>
              )}
              <Button variant="ghost" onClick={() => setMode("menu")}>
                {t.menu}
              </Button>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-xl font-bold">
              {t.score}: {score}
            </p>
            {gameOver && <p className="text-lg text-destructive">{t.gameOver}</p>}
            {isPaused && <p className="text-lg">{t.paused}</p>}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg mx-auto shadow-2xl border-4 border-green-700"
            style={{
              width: GRID_SIZE * 20,
              height: GRID_SIZE * 20,
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              gap: "1px",
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE
              const y = Math.floor(index / GRID_SIZE)
              const isSnake = snake.some((segment) => segment.x === x && segment.y === y)
              const isHead = snake[0].x === x && snake[0].y === y
              const isFood = food.x === x && food.y === y

              return (
                <div key={index} className={`${!isSnake && !isFood ? "bg-green-800/30" : ""}`}>
                  {isHead && <SnakeHead direction={direction} />}
                  {isSnake && !isHead && <SnakeBody />}
                  {isFood && <SnakeFood />}
                </div>
              )
            })}
          </div>

          {mode === "local" && <p className="text-center mt-4 text-sm text-muted-foreground">{t.useArrowKeys}</p>}

          {gameOver && (
            <Button className="w-full mt-4" onClick={resetGame}>
              {t.playAgain}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
