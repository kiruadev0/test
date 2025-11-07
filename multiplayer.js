// Simple multiplayer manager using localStorage for demo
// In production, use WebSocket or Firebase
class MultiplayerManager {
  constructor() {
    this.roomCode = null
    this.isHost = false
    this.gameType = null
    this.onPlayerJoined = null
    this.onGameUpdate = null
    this.pollInterval = null
  }

  createRoom(roomCode, gameType) {
    this.roomCode = roomCode
    this.isHost = true
    this.gameType = gameType

    const roomData = {
      host: true,
      gameType: gameType,
      players: 1,
      gameState: null,
      timestamp: Date.now(),
    }

    localStorage.setItem(`room_${roomCode}`, JSON.stringify(roomData))
    this.startPolling()
  }

  joinRoom(roomCode, gameType) {
    this.roomCode = roomCode
    this.isHost = false
    this.gameType = gameType

    const roomDataStr = localStorage.getItem(`room_${roomCode}`)
    if (roomDataStr) {
      const roomData = JSON.parse(roomDataStr)
      roomData.players = 2
      localStorage.setItem(`room_${roomCode}`, JSON.stringify(roomData))

      if (this.onPlayerJoined) {
        this.onPlayerJoined()
      }
    }

    this.startPolling()
  }

  sendGameState(gameState) {
    if (!this.roomCode) return

    const roomDataStr = localStorage.getItem(`room_${this.roomCode}`)
    if (roomDataStr) {
      const roomData = JSON.parse(roomDataStr)
      roomData.gameState = gameState
      roomData.timestamp = Date.now()
      localStorage.setItem(`room_${this.roomCode}`, JSON.stringify(roomData))
    }
  }

  startPolling() {
    this.pollInterval = setInterval(() => {
      const roomDataStr = localStorage.getItem(`room_${this.roomCode}`)
      if (roomDataStr) {
        const roomData = JSON.parse(roomDataStr)

        if (!this.isHost && roomData.players === 2 && this.onPlayerJoined) {
          this.onPlayerJoined()
        }

        if (roomData.gameState && this.onGameUpdate) {
          this.onGameUpdate(roomData.gameState)
        }
      }
    }, 500)
  }

  disconnect() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }

    if (this.roomCode && this.isHost) {
      localStorage.removeItem(`room_${this.roomCode}`)
    }

    this.roomCode = null
    this.isHost = false
    this.gameType = null
  }
}

window.MultiplayerManager = new MultiplayerManager()
