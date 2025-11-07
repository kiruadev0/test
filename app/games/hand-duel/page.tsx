"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Difficulty } from "@/lib/game-ai"
import Link from "next/link"

type Choice = "rock" | "paper" | "scissors"
type GameMode = "menu" | "ai" | "local"

const choices: Choice[] = ["rock", "paper", "scissors"]
const emojis = { rock: "✊", paper: "✋", scissors: "✌️" }

export default function HandDuelPage() {
  const [mode, setMode] = useState<GameMode>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
  const [aiChoice, setAIChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [scores, setScores] = useState({ player: 0, ai: 0 })

  const getAIChoice = (difficulty: Difficulty): Choice => {
    if (difficulty === "easy") {
      return choices[Math.floor(Math.random() * 3)]
    }

    // Medium: slight bias towards countering player's last move
    if (difficulty === "medium" && playerChoice) {
      if (Math.random() < 0.4) {
        const counters = { rock: "paper", paper: "scissors", scissors: "rock" } as const
        return counters[playerChoice]
      }
    }

    // Hard: strong bias towards countering
    if (difficulty === "hard" && playerChoice) {
      if (Math.random() < 0.7) {
        const counters = { rock: "paper", paper: "scissors", scissors: "rock" } as const
        return counters[playerChoice]
      }
    }

    return choices[Math.floor(Math.random() * 3)]
  }

  const determineWinner = (player: Choice, ai: Choice): string => {
    if (player === ai) return "Draw!"
    if (
      (player === "rock" && ai === "scissors") ||
      (player === "paper" && ai === "rock") ||
      (player === "scissors" && ai === "paper")
    ) {
      return "You Win!"
    }
    return "AI Wins!"
  }

  const playRound = (choice: Choice) => {
    const ai = getAIChoice(difficulty)
    setPlayerChoice(choice)
    setAIChoice(ai)

    const roundResult = determineWinner(choice, ai)
    setResult(roundResult)

    if (roundResult === "You Win!") {
      setScores((prev) => ({ ...prev, player: prev.player + 1 }))
    } else if (roundResult === "AI Wins!") {
      setScores((prev) => ({ ...prev, ai: prev.ai + 1 }))
    }
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setAIChoice(null)
    setResult(null)
    setScores({ player: 0, ai: 0 })
  }

  const startGame = (selectedMode: GameMode, selectedDifficulty?: Difficulty) => {
    setMode(selectedMode)
    if (selectedDifficulty) setDifficulty(selectedDifficulty)
    resetGame()
  }

  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Hand Duel</CardTitle>
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
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => startGame("ai", difficulty)}>
              Play vs AI
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Hand Duel</CardTitle>
            <Button variant="ghost" onClick={() => setMode("menu")}>
              Menu
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-lg font-semibold">
              Score: You {scores.player} - {scores.ai} AI
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {result && (
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-8 text-6xl">
                <div className="flex flex-col items-center">
                  <span>{playerChoice && emojis[playerChoice]}</span>
                  <span className="text-sm mt-2">You</span>
                </div>
                <div className="flex items-center text-2xl">vs</div>
                <div className="flex flex-col items-center">
                  <span>{aiChoice && emojis[aiChoice]}</span>
                  <span className="text-sm mt-2">AI</span>
                </div>
              </div>
              <p className="text-2xl font-bold">{result}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {choices.map((choice) => (
              <Button
                key={choice}
                onClick={() => playRound(choice)}
                className="h-32 text-6xl hover:scale-110 transition-transform"
                variant="secondary"
              >
                {emojis[choice]}
              </Button>
            ))}
          </div>

          <Button className="w-full bg-transparent" variant="outline" onClick={resetGame}>
            Reset Score
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
