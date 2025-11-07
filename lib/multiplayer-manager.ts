import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface GameRoom {
  id: string
  gameType: string
  hostId: string
  guestId: string | null
  gameState: any
  status: "waiting" | "playing" | "finished"
  createdAt: string
}

export class MultiplayerManager {
  private supabase = createClient()
  private channel: RealtimeChannel | null = null
  private roomId: string | null = null

  async createRoom(gameType: string, initialState: any): Promise<string> {
    const roomId = this.generateRoomCode()
    const playerId = this.generatePlayerId()

    const { error } = await this.supabase.from("game_rooms").insert({
      id: roomId,
      game_type: gameType,
      host_id: playerId,
      game_state: initialState,
      status: "waiting",
    })

    if (error) {
      console.error("[v0] Error creating room:", error)
      throw error
    }

    this.roomId = roomId
    localStorage.setItem("playerId", playerId)
    return roomId
  }

  async joinRoom(roomId: string): Promise<boolean> {
    const playerId = this.generatePlayerId()

    const { data: room, error } = await this.supabase.from("game_rooms").select("*").eq("id", roomId).single()

    if (error || !room) {
      console.error("[v0] Room not found:", error)
      return false
    }

    if (room.guest_id) {
      console.error("[v0] Room is full")
      return false
    }

    const { error: updateError } = await this.supabase
      .from("game_rooms")
      .update({ guest_id: playerId, status: "playing" })
      .eq("id", roomId)

    if (updateError) {
      console.error("[v0] Error joining room:", updateError)
      return false
    }

    this.roomId = roomId
    localStorage.setItem("playerId", playerId)
    return true
  }

  subscribeToRoom(roomId: string, onUpdate: (gameState: any) => void) {
    this.channel = this.supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          console.log("[v0] Room updated:", payload)
          onUpdate(payload.new.game_state)
        },
      )
      .subscribe()
  }

  async updateGameState(roomId: string, gameState: any) {
    const { error } = await this.supabase.from("game_rooms").update({ game_state: gameState }).eq("id", roomId)

    if (error) {
      console.error("[v0] Error updating game state:", error)
    }
  }

  async getRoom(roomId: string): Promise<GameRoom | null> {
    const { data, error } = await this.supabase.from("game_rooms").select("*").eq("id", roomId).single()

    if (error) {
      console.error("[v0] Error fetching room:", error)
      return null
    }

    return data
  }

  isHost(room: GameRoom): boolean {
    const playerId = localStorage.getItem("playerId")
    return room.host_id === playerId
  }

  unsubscribe() {
    if (this.channel) {
      this.channel.unsubscribe()
      this.channel = null
    }
  }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}
