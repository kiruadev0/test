// AI logic for all games with difficulty levels

export type Difficulty = "easy" | "medium" | "hard"

// Connect 4 AI
export function getConnect4AIMove(board: (number | null)[][], difficulty: Difficulty): number {
  const cols = board[0].length

  if (difficulty === "easy") {
    // Random valid move
    const validCols = []
    for (let col = 0; col < cols; col++) {
      if (board[0][col] === null) validCols.push(col)
    }
    return validCols[Math.floor(Math.random() * validCols.length)]
  }

  // Medium and Hard: Use minimax with different depths
  const depth = difficulty === "medium" ? 3 : 5
  return minimaxConnect4(board, depth, true).col
}

function minimaxConnect4(
  board: (number | null)[][],
  depth: number,
  isMaximizing: boolean,
): { score: number; col: number } {
  const winner = checkConnect4Winner(board)
  if (winner === 2) return { score: 100, col: -1 }
  if (winner === 1) return { score: -100, col: -1 }
  if (depth === 0 || isBoardFull(board)) return { score: 0, col: -1 }

  const cols = board[0].length
  let bestCol = -1
  let bestScore = isMaximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY

  for (let col = 0; col < cols; col++) {
    if (board[0][col] !== null) continue

    const newBoard = JSON.parse(JSON.stringify(board))
    const row = dropPiece(newBoard, col, isMaximizing ? 2 : 1)
    if (row === -1) continue

    const { score } = minimaxConnect4(newBoard, depth - 1, !isMaximizing)

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    } else {
      if (score < bestScore) {
        bestScore = score
        bestCol = col
      }
    }
  }

  return { score: bestScore, col: bestCol }
}

function dropPiece(board: (number | null)[][], col: number, player: number): number {
  for (let row = board.length - 1; row >= 0; row--) {
    if (board[row][col] === null) {
      board[row][col] = player
      return row
    }
  }
  return -1
}

function checkConnect4Winner(board: (number | null)[][]): number | null {
  const rows = board.length
  const cols = board[0].length

  // Check horizontal
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const val = board[row][col]
      if (val && val === board[row][col + 1] && val === board[row][col + 2] && val === board[row][col + 3]) {
        return val
      }
    }
  }

  // Check vertical
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows - 3; row++) {
      const val = board[row][col]
      if (val && val === board[row + 1][col] && val === board[row + 2][col] && val === board[row + 3][col]) {
        return val
      }
    }
  }

  // Check diagonal (down-right)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 0; col < cols - 3; col++) {
      const val = board[row][col]
      if (
        val &&
        val === board[row + 1][col + 1] &&
        val === board[row + 2][col + 2] &&
        val === board[row + 3][col + 3]
      ) {
        return val
      }
    }
  }

  // Check diagonal (down-left)
  for (let row = 0; row < rows - 3; row++) {
    for (let col = 3; col < cols; col++) {
      const val = board[row][col]
      if (
        val &&
        val === board[row + 1][col - 1] &&
        val === board[row + 2][col - 2] &&
        val === board[row + 3][col - 3]
      ) {
        return val
      }
    }
  }

  return null
}

function isBoardFull(board: (number | null)[][]): boolean {
  return board[0].every((cell) => cell !== null)
}

// Tic-Tac-Toe AI
export function getTicTacToeAIMove(board: (string | null)[], difficulty: Difficulty): number {
  if (difficulty === "easy") {
    const empty = board.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1)
    return empty[Math.floor(Math.random() * empty.length)]
  }

  // Medium: 70% optimal, 30% random
  if (difficulty === "medium" && Math.random() < 0.3) {
    const empty = board.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1)
    return empty[Math.floor(Math.random() * empty.length)]
  }

  // Hard: Always optimal using minimax
  return minimaxTicTacToe(board, "O").index
}

function minimaxTicTacToe(board: (string | null)[], player: string): { index: number; score: number } {
  const availSpots = board.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1)

  const winner = checkTicTacToeWinner(board)
  if (winner === "X") return { index: -1, score: -10 }
  if (winner === "O") return { index: -1, score: 10 }
  if (availSpots.length === 0) return { index: -1, score: 0 }

  const moves: { index: number; score: number }[] = []

  for (const spot of availSpots) {
    const newBoard = [...board]
    newBoard[spot] = player

    const result = minimaxTicTacToe(newBoard, player === "O" ? "X" : "O")
    moves.push({ index: spot, score: result.score })
  }

  let bestMove: { index: number; score: number }
  if (player === "O") {
    let bestScore = Number.NEGATIVE_INFINITY
    bestMove = moves[0]
    for (const move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score
        bestMove = move
      }
    }
  } else {
    let bestScore = Number.POSITIVE_INFINITY
    bestMove = moves[0]
    for (const move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score
        bestMove = move
      }
    }
  }

  return bestMove
}

function checkTicTacToeWinner(board: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return null
}

// Hangman AI
export function getHangmanAIGuess(word: string, guessedLetters: Set<string>, difficulty: Difficulty): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const available = alphabet.split("").filter((l) => !guessedLetters.has(l))

  if (difficulty === "easy") {
    return available[Math.floor(Math.random() * available.length)]
  }

  // Medium and Hard: Use letter frequency
  const frequencies: { [key: string]: number } = {
    e: 12.7,
    t: 9.1,
    a: 8.2,
    o: 7.5,
    i: 7.0,
    n: 6.7,
    s: 6.3,
    h: 6.1,
    r: 6.0,
    d: 4.3,
    l: 4.0,
    c: 2.8,
    u: 2.8,
    m: 2.4,
    w: 2.4,
    f: 2.2,
    g: 2.0,
    y: 2.0,
    p: 1.9,
    b: 1.5,
    v: 1.0,
    k: 0.8,
    j: 0.2,
    x: 0.2,
    q: 0.1,
    z: 0.1,
  }

  // For hard mode, also consider revealed pattern
  if (difficulty === "hard") {
    const pattern = word
      .split("")
      .map((l) => (guessedLetters.has(l) ? l : "_"))
      .join("")
    // Prioritize letters that fit common patterns
    const vowels = ["a", "e", "i", "o", "u"].filter((v) => !guessedLetters.has(v))
    if (vowels.length > 0 && pattern.includes("_")) {
      return vowels[0]
    }
  }

  // Sort by frequency and pick the best available
  const sorted = available.sort((a, b) => (frequencies[b] || 0) - (frequencies[a] || 0))
  return sorted[0]
}

// Uno AI
export function getUnoAIMove(
  hand: any[],
  topCard: any,
  difficulty: Difficulty,
): { cardIndex: number; chosenColor?: string } | null {
  const playableCards = hand.map((card, index) => ({ card, index })).filter(({ card }) => canPlayUnoCard(card, topCard))

  if (playableCards.length === 0) return null

  if (difficulty === "easy") {
    const random = playableCards[Math.floor(Math.random() * playableCards.length)]
    return {
      cardIndex: random.index,
      chosenColor:
        random.card.type === "wild" ? ["red", "blue", "green", "yellow"][Math.floor(Math.random() * 4)] : undefined,
    }
  }

  // Medium and Hard: Prioritize special cards and color matching
  const prioritized = playableCards.sort((a, b) => {
    const scoreA = getUnoCardScore(a.card)
    const scoreB = getUnoCardScore(b.card)
    return scoreB - scoreA
  })

  const best = prioritized[0]
  let chosenColor: string | undefined

  if (best.card.type === "wild") {
    // Choose color with most cards in hand
    const colorCounts: { [key: string]: number } = { red: 0, blue: 0, green: 0, yellow: 0 }
    hand.forEach((card) => {
      if (card.color && card.color !== "black") {
        colorCounts[card.color]++
      }
    })
    chosenColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0]
  }

  return { cardIndex: best.index, chosenColor }
}

function canPlayUnoCard(card: any, topCard: any): boolean {
  if (card.type === "wild") return true
  return card.color === topCard.color || card.value === topCard.value
}

function getUnoCardScore(card: any): number {
  if (card.type === "wild") return 50
  if (card.value === "skip" || card.value === "reverse" || card.value === "draw2") return 20
  return Number.parseInt(card.value) || 10
}

// Snake AI (for multiplayer snake racing)
export function getSnakeAIDirection(
  snake: { x: number; y: number }[],
  food: { x: number; y: number },
  gridSize: number,
  currentDirection: string,
  difficulty: Difficulty,
): string {
  const head = snake[0]

  if (difficulty === "easy") {
    // Simple pathfinding with some randomness
    if (Math.random() < 0.3) {
      const directions = ["up", "down", "left", "right"].filter((d) => {
        if (currentDirection === "up" && d === "down") return false
        if (currentDirection === "down" && d === "up") return false
        if (currentDirection === "left" && d === "right") return false
        if (currentDirection === "right" && d === "left") return false
        return true
      })
      return directions[Math.floor(Math.random() * directions.length)]
    }
  }

  // Medium and Hard: A* pathfinding
  const dx = food.x - head.x
  const dy = food.y - head.y

  const possibleMoves: { direction: string; priority: number }[] = []

  if (dy < 0 && currentDirection !== "down") {
    possibleMoves.push({ direction: "up", priority: Math.abs(dy) })
  }
  if (dy > 0 && currentDirection !== "up") {
    possibleMoves.push({ direction: "down", priority: Math.abs(dy) })
  }
  if (dx < 0 && currentDirection !== "right") {
    possibleMoves.push({ direction: "left", priority: Math.abs(dx) })
  }
  if (dx > 0 && currentDirection !== "left") {
    possibleMoves.push({ direction: "right", priority: Math.abs(dx) })
  }

  // Filter out moves that would cause collision
  const safeMoves = possibleMoves.filter((move) => {
    const newHead = { ...head }
    if (move.direction === "up") newHead.y--
    if (move.direction === "down") newHead.y++
    if (move.direction === "left") newHead.x--
    if (move.direction === "right") newHead.x++

    // Check boundaries
    if (newHead.x < 0 || newHead.x >= gridSize || newHead.y < 0 || newHead.y >= gridSize) {
      return false
    }

    // Check self collision
    return !snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
  })

  if (safeMoves.length === 0) {
    // Emergency: try any valid move
    const emergency = ["up", "down", "left", "right"].filter((d) => {
      if (currentDirection === "up" && d === "down") return false
      if (currentDirection === "down" && d === "up") return false
      if (currentDirection === "left" && d === "right") return false
      if (currentDirection === "right" && d === "left") return false
      return true
    })
    return emergency[0] || currentDirection
  }

  // Sort by priority and return best move
  safeMoves.sort((a, b) => b.priority - a.priority)
  return safeMoves[0].direction
}
