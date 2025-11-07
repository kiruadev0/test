"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getHangmanAIGuess, type Difficulty } from "@/lib/game-ai"
import Link from "next/link"

type GameMode = "menu" | "ai" | "local" | "online"

const WORDS = [
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "supabase",
  "database",
  "algorithm",
  "function",
  "variable",
  "component",
  "interface",
  "programming",
  "developer",
  "software",
  "computer",
  "keyboard",
  "monitor",
  "internet",
]

export default function HangmanPage() {
  const [mode, setMode] = useState<GameMode>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [word, setWord] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [winner, setWinner] = useState<number | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const maxWrongGuesses = 6

  const initGame = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
    setWord(randomWord)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setCurrentPlayer(1)
    setWinner(null)
    setIsAIThinking(false)
  }

  const guessLetter = (letter: string) => {
    if (guessedLetters.has(letter) || winner) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    if (!word.includes(letter)) {
      const newWrong = wrongGuesses + 1
      setWrongGuesses(newWrong)

      if (newWrong >= maxWrongGuesses) {
        setWinner(currentPlayer === 1 ? 2 : 1)
      }
    }

    // Check if word is complete
    const isComplete = word.split("").every((l) => newGuessed.has(l))
    if (isComplete) {
      setWinner(currentPlayer)
    } else if (mode === "local") {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    }
  }

  useEffect(() => {
    if (mode === "ai" && currentPlayer === 2 && !winner && !isAIThinking) {
      setIsAIThinking(true)
      setTimeout(() => {
        const aiGuess = getHangmanAIGuess(word, guessedLetters, difficulty)
        guessLetter(aiGuess)
        setIsAIThinking(false)
      }, 800)
    }
  }, [currentPlayer, mode, winner, isAIThinking, guessedLetters])

  const startGame = (selectedMode: GameMode, selectedDifficulty?: Difficulty) => {
    setMode(selectedMode)
    if (selectedDifficulty) setDifficulty(selectedDifficulty)
    initGame()
  }

  useEffect(() => {
    if (mode !== "menu") {
      initGame()
    }
  }, [mode])

  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Hangman</CardTitle>
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

  const displayWord = word
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ")

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

  const drawHangman = () => {
    const parts = [
      <circle key="head" cx="100" cy="50" r="20" stroke="white" strokeWidth="3" fill="none" />,
      <line key="body" x1="100" y1="70" x2="100" y2="120" stroke="white" strokeWidth="3" />,
      <line key="leftarm" x1="100" y1="85" x2="75" y2="100" stroke="white" strokeWidth="3" />,
      <line key="rightarm" x1="100" y1="85" x2="125" y2="100" stroke="white" strokeWidth="3" />,
      <line key="leftleg" x1="100" y1="120" x2="80" y2="150" stroke="white" strokeWidth="3" />,
      <line key="rightleg" x1="100" y1="120" x2="120" y2="150" stroke="white" strokeWidth="3" />,
    ]
    return parts.slice(0, wrongGuesses)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Hangman</CardTitle>
            <Button variant="ghost" onClick={() => setMode("menu")}>
              Menu
            </Button>
          </div>
          <div className="text-center mt-2">
            {winner ? (
              <p className="text-xl font-bold">
                {mode === "ai" ? (winner === 1 ? "You Win!" : "AI Wins!") : `Player ${winner} Wins!`}
              </p>
            ) : (
              <p className="text-lg">
                {isAIThinking ? "AI is thinking..." : mode === "ai" ? "Your Turn" : `Player ${currentPlayer}'s Turn`}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hangman Drawing */}
          <div className="flex justify-center">
            <svg width="200" height="200" className="bg-orange-600/30 rounded-lg">
              <line x1="20" y1="180" x2="180" y2="180" stroke="white" strokeWidth="3" />
              <line x1="50" y1="180" x2="50" y2="20" stroke="white" strokeWidth="3" />
              <line x1="50" y1="20" x2="100" y2="20" stroke="white" strokeWidth="3" />
              <line x1="100" y1="20" x2="100" y2="30" stroke="white" strokeWidth="3" />
              {drawHangman()}
            </svg>
          </div>

          {/* Word Display */}
          <div className="text-center">
            <p className="text-4xl font-mono font-bold tracking-wider text-white">{displayWord}</p>
            <p className="text-sm mt-2 text-white/80">
              Wrong guesses: {wrongGuesses} / {maxWrongGuesses}
            </p>
          </div>

          {/* Letter Buttons */}
          <div className="grid grid-cols-7 gap-2">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                onClick={() => guessLetter(letter)}
                disabled={
                  guessedLetters.has(letter) ||
                  winner !== null ||
                  (mode === "ai" && currentPlayer === 2) ||
                  isAIThinking
                }
                variant={guessedLetters.has(letter) ? (word.includes(letter) ? "default" : "destructive") : "secondary"}
                className="aspect-square"
              >
                {letter.toUpperCase()}
              </Button>
            ))}
          </div>

          {winner && (
            <div className="space-y-2">
              <p className="text-center text-white">
                The word was: <span className="font-bold">{word}</span>
              </p>
              <Button className="w-full" onClick={initGame}>
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
