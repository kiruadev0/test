type CardColor = "red" | "blue" | "green" | "yellow" | "black"

const colorMap = {
  red: { primary: "#ef4444", secondary: "#dc2626", accent: "#fca5a5" },
  blue: { primary: "#3b82f6", secondary: "#2563eb", accent: "#93c5fd" },
  green: { primary: "#22c55e", secondary: "#16a34a", accent: "#86efac" },
  yellow: { primary: "#eab308", secondary: "#ca8a04", accent: "#fde047" },
  black: { primary: "#1f2937", secondary: "#111827", accent: "#6b7280" },
}

export const UnoCard = ({ color, value }: { color: CardColor; value: string }) => {
  const colors = colorMap[color]

  return (
    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id={`cardGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <filter id="cardShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Card background */}
      <rect x="2" y="2" width="96" height="136" rx="8" fill="url(#cardGrad-${color})" filter="url(#cardShadow)" />

      {/* White oval in center */}
      <ellipse cx="50" cy="70" rx="35" ry="45" fill="white" opacity="0.95" />

      {/* Value in center */}
      <text
        x="50"
        y="80"
        fontSize="32"
        fontWeight="bold"
        fill={colors.primary}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        {value}
      </text>

      {/* Corner decorations */}
      <circle cx="15" cy="15" r="8" fill={colors.accent} opacity="0.6" />
      <circle cx="85" cy="125" r="8" fill={colors.accent} opacity="0.6" />

      {/* Geometric pattern */}
      <path d="M 20 20 L 30 20 L 25 30 Z" fill={colors.accent} opacity="0.4" transform="rotate(45 25 25)" />
      <path d="M 70 110 L 80 110 L 75 120 Z" fill={colors.accent} opacity="0.4" transform="rotate(225 75 115)" />
    </svg>
  )
}
