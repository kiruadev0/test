export const Connect4Disc = ({ player }: { player: 1 | 2 }) => {
  const colors =
    player === 1
      ? { primary: "#ef4444", secondary: "#dc2626", highlight: "#fca5a5" }
      : { primary: "#fbbf24", secondary: "#f59e0b", highlight: "#fde047" }

  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <defs>
        <radialGradient id={`discGrad-${player}`}>
          <stop offset="0%" stopColor={colors.highlight} />
          <stop offset="50%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </radialGradient>
        <filter id="discShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
      </defs>
      <circle cx="20" cy="20" r="16" fill={`url(#discGrad-${player})`} filter="url(#discShadow)" />
      <circle cx="20" cy="20" r="14" fill="none" stroke={colors.highlight} strokeWidth="1" opacity="0.3" />
      <circle cx="15" cy="15" r="3" fill={colors.highlight} opacity="0.6" />
    </svg>
  )
}

export const Connect4Board = () => (
  <svg viewBox="0 0 280 240" className="w-full h-full">
    <defs>
      <linearGradient id="boardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>
    </defs>
    <rect width="280" height="240" rx="12" fill="url(#boardGrad)" />
  </svg>
)
