"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/i18n"

interface MultiplayerLobbyProps {
  onCreateRoom: () => void
  onJoinRoom: (roomId: string) => void
  onBack: () => void
}

export function MultiplayerLobby({ onCreateRoom, onJoinRoom, onBack }: MultiplayerLobbyProps) {
  const [roomCode, setRoomCode] = useState("")
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t.multiplayerLobby || "Multiplayer Lobby"}
        </h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t.createRoom || "Create Room"}</h2>
            <Button onClick={onCreateRoom} className="w-full" size="lg">
              {t.createNewRoom || "Create New Room"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t.or || "OR"}</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">{t.joinRoom || "Join Room"}</h2>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder={t.enterRoomCode || "Enter room code"}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-lg tracking-wider"
              />
              <Button
                onClick={() => onJoinRoom(roomCode)}
                disabled={roomCode.length !== 6}
                className="w-full"
                size="lg"
              >
                {t.joinGame || "Join Game"}
              </Button>
            </div>
          </div>

          <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
            {t.back || "Back"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
