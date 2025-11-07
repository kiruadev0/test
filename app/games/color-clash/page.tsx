"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUnoAIMove, type Difficulty } from "@/lib/game-ai"
import Link from "next/link"

type GameMode = "menu" | "ai" | "local" | "online"
type UnoCard = {
  color: "red" | "blue" | "green" | "yellow" | "black"
  value: string
  type: "number" | "action" | "wild"
}

const createDeck = (): UnoCard[] => {
  const deck: UnoCard[] = []
  const colors: ("red" | "blue" | "green" | "yellow")[] = ["red", "blue", "green", "yellow"]

  colors.forEach((color) => {
    deck.push({ color, value: "0", type: "number" })
    for (let i = 1; i <= 9; i++) {
      deck.push({ color, value: String(i), type: "number" })
      deck.push({ color, value: String(i), type: "number" })
    }
    ;["skip", "reverse", "draw2"].forEach((action) => {
      deck.push({ color, value: action, type: "action" })
      deck.push({ color, value: action, type: "action" })
    })
  })

  for (let i = 0; i < 4; i++) {
    deck.push({ color: "black", value: "wild", type: "wild" })
    deck.push({ color: "black", value: "wild-draw4", type: "wild" })
  }

  return deck.sort(() => Math.random() - 0.5)
}

export default function UnoPage() {
  const [mode, setMode] = useState<GameMode>("menu")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [deck, setDeck] = useState<UnoCard[]>([])
  const [playerHand, setPlayerHand] = useState<UnoCard[]>([])
  const [aiHand, setAiHand] = useState<UnoCard[]>([])
  const [discardPile, setDiscardPile] = useState<UnoCard[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [winner, setWinner] = useState<number | null>(null)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [pendingWildCard, setPendingWildCard] = useState<number | null>(null)

  const initGame = () => {
    const newDeck = createDeck()
    const player = newDeck.splice(0, 7)
    const ai = newDeck.splice(0, 7)
    const firstCard = newDeck.splice(0, 1)

    setDeck(newDeck)
    setPlayerHand(player)
    setAiHand(ai)
    setDiscardPile(firstCard)
    setCurrentPlayer(1)
    setWinner(null)
    setIsAIThinking(false)
  }

  const canPlayCard = (card: UnoCard, topCard: UnoCard): boolean => {
    if (card.type === "wild") return true
    return card.color === topCard.color || card.value === topCard.value
  }

  const drawCard = () => {
    if (deck.length === 0) return
    const newDeck = [...deck]
    const drawnCard = newDeck.pop()!

    if (currentPlayer === 1) {
      setPlayerHand([...playerHand, drawnCard])
    } else {
      setAiHand([...aiHand, drawnCard])
    }

    setDeck(newDeck)
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
  }

  const playCard = (cardIndex: number, chosenColor?: string) => {
    const hand = currentPlayer === 1 ? playerHand : aiHand
    const card = hand[cardIndex]
    const topCard = discardPile[discardPile.length - 1]

    if (!canPlayCard(card, topCard)) return

    if (card.type === "wild" && !chosenColor) {
      setPendingWildCard(cardIndex)
      setShowColorPicker(true)
      return
    }

    const newHand = hand.filter((_, i) => i !== cardIndex)
    const playedCard = chosenColor ? { ...card, color: chosenColor as any } : card

    if (currentPlayer === 1) {
      setPlayerHand(newHand)
      if (newHand.length === 0) setWinner(1)
    } else {
      setAiHand(newHand)
      if (newHand.length === 0) setWinner(2)
    }

    setDiscardPile([...discardPile, playedCard])
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    setPendingWildCard(null)
    setShowColorPicker(false)
  }

  const handleColorChoice = (color: string) => {
    if (pendingWildCard !== null) {
      playCard(pendingWildCard, color)
    }
  }

  useEffect(() => {
    if (mode === "ai" && currentPlayer === 2 && !winner && !isAIThinking) {
      setIsAIThinking(true)
      setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1]
        const aiMove = getUnoAIMove(aiHand, topCard, difficulty)

        if (aiMove) {
          playCard(aiMove.cardIndex, aiMove.chosenColor)
        } else {
          drawCard()
        }
        setIsAIThinking(false)
      }, 1000)
    }
  }, [currentPlayer, mode, winner, isAIThinking])

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
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-blue-600 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center">UNO</CardTitle>
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

  const getCardColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
      black: "bg-gray-800",
    }
    return colors[color] || "bg-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-blue-600 to-green-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">UNO</CardTitle>
            <Button variant="ghost" onClick={() => setMode("menu")}>
              Menu
            </Button>
          </div>
          <div className="text-center mt-2">
            {winner ? (
              <p className="text-xl font-bold">{winner === 1 ? "You Win!" : "AI Wins!"}</p>
            ) : (
              <p className="text-lg">
                {isAIThinking ? "AI is thinking..." : currentPlayer === 1 ? "Your Turn" : "AI's Turn"}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Hand */}
          <div className="text-center">
            <p className="text-sm mb-2">AI Cards: {aiHand.length}</p>
            <div className="flex justify-center gap-1">
              {aiHand.map((_, i) => (
                <div key={i} className="w-12 h-16 bg-gray-700 rounded border-2 border-white" />
              ))}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="flex justify-center items-center gap-4">
            <div className="text-center">
              <p className="text-sm mb-2">Deck: {deck.length}</p>
              <button
                onClick={drawCard}
                disabled={currentPlayer !== 1 || winner !== null}
                className="w-20 h-28 bg-gray-700 rounded-lg border-4 border-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-white text-2xl">🎴</span>
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm mb-2">Top Card</p>
              {discardPile.length > 0 && (
                <div
                  className={`w-20 h-28 ${getCardColor(discardPile[discardPile.length - 1].color)} rounded-lg border-4 border-white flex items-center justify-center`}
                >
                  <span className="text-white text-2xl font-bold">{discardPile[discardPile.length - 1].value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Player Hand */}
          <div className="text-center">
            <p className="text-sm mb-2">Your Cards</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {playerHand.map((card, i) => (
                <button
                  key={i}
                  onClick={() => playCard(i)}
                  disabled={
                    currentPlayer !== 1 || winner !== null || !canPlayCard(card, discardPile[discardPile.length - 1])
                  }
                  className={`w-20 h-28 ${getCardColor(card.color)} rounded-lg border-4 border-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  <span className="text-white text-xl font-bold">{card.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          {showColorPicker && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-6">
                <CardTitle className="text-center mb-4">Choose a Color</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  {["red", "blue", "green", "yellow"].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChoice(color)}
                      className={`w-24 h-24 ${getCardColor(color)} rounded-lg border-4 border-white hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}

          {winner && (
            <Button className="w-full" onClick={initGame}>
              Play Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
