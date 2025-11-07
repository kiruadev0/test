"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const WORDS = [
  "cat",
  "dog",
  "house",
  "tree",
  "car",
  "sun",
  "moon",
  "star",
  "flower",
  "bird",
  "fish",
  "apple",
  "banana",
  "pizza",
  "guitar",
  "phone",
  "computer",
  "book",
  "pencil",
  "clock",
]

type GameMode = "menu" | "draw" | "guess"

export default function SketchGuessPage() {
  const [mode, setMode] = useState<GameMode>("menu")
  const [currentWord, setCurrentWord] = useState("")
  const [guess, setGuess] = useState("")
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(3)
  const [gameOver, setGameOver] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (mode === "draw" && canvasRef.current) {
      const canvas = canvasRef.current
      canvas.width = 600
      canvas.height = 400

      const context = canvas.getContext("2d")
      if (context) {
        context.lineCap = "round"
        context.strokeStyle = color
        context.lineWidth = brushSize
        contextRef.current = context
      }
    }
  }, [mode, color, brushSize])

  useEffect(() => {
    if (mode === "draw" && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && mode === "draw") {
      setMode("guess")
      setTimeLeft(30)
    }
  }, [timeLeft, mode, gameOver])

  useEffect(() => {
    if (mode === "guess" && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && mode === "guess") {
      endRound(false)
    }
  }, [timeLeft, mode, gameOver])

  const startGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(word)
    setMode("draw")
    setTimeLeft(60)
    setScore(0)
    setRound(1)
    setGameOver(false)
    setGuess("")
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    const rect = canvas.getBoundingClientRect()
    context.beginPath()
    context.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return

    const rect = canvas.getBoundingClientRect()
    context.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    context.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const submitGuess = () => {
    const correct = guess.toLowerCase().trim() === currentWord.toLowerCase()
    endRound(correct)
  }

  const endRound = (correct: boolean) => {
    if (correct) {
      setScore(score + Math.max(10, timeLeft))
    }

    if (round >= 5) {
      setGameOver(true)
    } else {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)]
      setCurrentWord(word)
      setMode("draw")
      setTimeLeft(60)
      setRound(round + 1)
      setGuess("")
      clearCanvas()
    }
  }

  if (mode === "menu" || gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Sketch & Guess</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gameOver && (
              <div className="bg-white p-4 rounded-lg text-center">
                <p className="text-2xl font-bold mb-2">Game Over!</p>
                <p className="text-xl">Final Score: {score}</p>
                <p className="text-sm text-muted-foreground mt-2">You completed {round - 1} rounds</p>
              </div>
            )}
            <p className="text-center text-white">
              Draw the word shown, then guess what you drew! Complete 5 rounds to finish.
            </p>
            <Button className="w-full" onClick={startGame}>
              {gameOver ? "Play Again" : "Start Game"}
            </Button>
            <Link href="/">
              <Button className="w-full" variant="ghost">
                Back to Games
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "draw") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Draw This Word</CardTitle>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Round {round}/5</p>
                <p className="text-lg font-semibold">Score: {score}</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-3xl font-bold text-purple-600 bg-white px-6 py-3 rounded-lg inline-block">
                {currentWord.toUpperCase()}
              </p>
              <p className="text-lg mt-2">Time: {timeLeft}s</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border-4 border-purple-600 rounded-lg bg-white cursor-crosshair w-full"
              style={{ maxWidth: "600px", aspectRatio: "3/2" }}
            />

            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex gap-2">
                {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-full border-4 ${color === c ? "border-white" : "border-gray-300"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-sm">Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-32"
                />
              </div>
              <Button onClick={clearCanvas} variant="outline">
                Clear
              </Button>
              <Button onClick={() => setMode("guess")} className="ml-auto">
                Done Drawing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Guess Your Drawing</CardTitle>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Round {round}/5</p>
              <p className="text-lg font-semibold">Score: {score}</p>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-lg">Time: {timeLeft}s</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <canvas
            ref={canvasRef}
            className="border-4 border-purple-600 rounded-lg bg-white w-full pointer-events-none"
            style={{ maxWidth: "600px", aspectRatio: "3/2" }}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">What did you draw?</label>
            <div className="flex gap-2">
              <Input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && submitGuess()}
                placeholder="Type your guess..."
                className="flex-1"
              />
              <Button onClick={submitGuess}>Submit</Button>
            </div>
          </div>

          <Button onClick={() => endRound(false)} variant="outline" className="w-full">
            Skip Round
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
