// Main application state
const app = {
  currentGame: null,
  gameMode: null,
  difficulty: null,
  roomCode: null,
  isMultiplayer: false,
}

// DOM elements
const mainMenu = document.getElementById("mainMenu")
const gameContainer = document.getElementById("gameContainer")
const gameTitle = document.getElementById("gameTitle")
const backButton = document.getElementById("backButton")
const modeSelection = document.getElementById("modeSelection")
const difficultySelection = document.getElementById("difficultySelection")
const multiplayerSetup = document.getElementById("multiplayerSetup")
const gameBoard = document.getElementById("gameBoard")

// Game cards
const gameCards = document.querySelectorAll(".game-card")

// Mode buttons
const aiModeButton = document.getElementById("aiMode")
const multiplayerModeButton = document.getElementById("multiplayerMode")

// Difficulty buttons
const difficultyButtons = document.querySelectorAll(".difficulty-button")

// Multiplayer buttons
const createRoomButton = document.getElementById("createRoom")
const joinRoomButton = document.getElementById("joinRoom")
const roomCodeInput = document.getElementById("roomCode")
const copyCodeButton = document.getElementById("copyCode")

// Game titles
const gameTitles = {
  connect4: "Puissance 4",
  uno: "Uno",
  hangman: "Pendu",
  tictactoe: "Morpion",
  snake: "Snake",
}

// Initialize event listeners
function init() {
  gameCards.forEach((card) => {
    card.addEventListener("click", () => {
      const game = card.dataset.game
      selectGame(game)
    })
  })

  backButton.addEventListener("click", returnToMenu)
  aiModeButton.addEventListener("click", selectAIMode)
  multiplayerModeButton.addEventListener("click", selectMultiplayerMode)

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const difficulty = button.dataset.difficulty
      selectDifficulty(difficulty)
    })
  })

  createRoomButton.addEventListener("click", createRoom)
  joinRoomButton.addEventListener("click", joinRoom)
  copyCodeButton.addEventListener("click", copyRoomCode)
}

function selectGame(game) {
  app.currentGame = game
  gameTitle.textContent = gameTitles[game]

  mainMenu.style.display = "none"
  gameContainer.style.display = "block"
  modeSelection.style.display = "block"
  difficultySelection.style.display = "none"
  multiplayerSetup.style.display = "none"
  gameBoard.style.display = "none"
}

function selectAIMode() {
  app.gameMode = "ai"
  app.isMultiplayer = false
  modeSelection.style.display = "none"
  difficultySelection.style.display = "block"
}

function selectMultiplayerMode() {
  app.gameMode = "multiplayer"
  app.isMultiplayer = true
  modeSelection.style.display = "none"
  multiplayerSetup.style.display = "block"
}

function selectDifficulty(difficulty) {
  app.difficulty = difficulty
  difficultySelection.style.display = "none"
  startGame()
}

function createRoom() {
  app.roomCode = generateRoomCode()
  document.getElementById("displayRoomCode").textContent = app.roomCode
  document.getElementById("roomInfo").style.display = "block"
  document.querySelector(".multiplayer-options").style.display = "none"

  // Initialize multiplayer connection
  if (window.MultiplayerManager) {
    window.MultiplayerManager.createRoom(app.roomCode, app.currentGame)
  }
}

function joinRoom() {
  const code = roomCodeInput.value.trim().toUpperCase()
  if (code.length === 6) {
    app.roomCode = code
    multiplayerSetup.style.display = "none"

    // Initialize multiplayer connection
    if (window.MultiplayerManager) {
      window.MultiplayerManager.joinRoom(code, app.currentGame)
    }

    startGame()
  } else {
    alert("Veuillez entrer un code de partie valide (6 caractères)")
  }
}

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function copyRoomCode() {
  const code = document.getElementById("displayRoomCode").textContent
  navigator.clipboard.writeText(code).then(() => {
    copyCodeButton.textContent = "Copié!"
    setTimeout(() => {
      copyCodeButton.textContent = "Copier"
    }, 2000)
  })
}

function startGame() {
  gameBoard.style.display = "block"
  gameBoard.innerHTML = ""

  // Start the appropriate game
  switch (app.currentGame) {
    case "connect4":
      if (window.Connect4) {
        new window.Connect4(gameBoard, app.difficulty, app.isMultiplayer, app.roomCode)
      }
      break
    case "uno":
      if (window.UnoGame) {
        new window.UnoGame(gameBoard, app.difficulty, app.isMultiplayer, app.roomCode)
      }
      break
    case "hangman":
      if (window.Hangman) {
        new window.Hangman(gameBoard, app.difficulty, app.isMultiplayer, app.roomCode)
      }
      break
    case "tictactoe":
      if (window.TicTacToe) {
        new window.TicTacToe(gameBoard, app.difficulty, app.isMultiplayer, app.roomCode)
      }
      break
    case "snake":
      if (window.SnakeGame) {
        new window.SnakeGame(gameBoard, app.difficulty)
      }
      break
  }
}

function returnToMenu() {
  // Clean up current game
  if (window.MultiplayerManager) {
    window.MultiplayerManager.disconnect()
  }

  app.currentGame = null
  app.gameMode = null
  app.difficulty = null
  app.roomCode = null
  app.isMultiplayer = false

  gameContainer.style.display = "none"
  mainMenu.style.display = "block"
  gameBoard.innerHTML = ""

  // Reset multiplayer UI
  document.getElementById("roomInfo").style.display = "none"
  document.querySelector(".multiplayer-options").style.display = "flex"
  roomCodeInput.value = ""
}

// Initialize the app
init()
