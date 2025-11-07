export const SnakeHead = ({ direction }: { direction: string }) => (
  <svg viewBox="0 0 20 20" className="w-full h-full">
    <defs>
      <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#84cc16" />
        <stop offset="100%" stopColor="#65a30d" />
      </linearGradient>
    </defs>
    <circle cx="10" cy="10" r="9" fill="url(#snakeGradient)" />
    {/* Eyes based on direction */}
    {direction === "right" && (
      <>
        <circle cx="13" cy="7" r="1.5" fill="white" />
        <circle cx="13" cy="13" r="1.5" fill="white" />
        <circle cx="13.5" cy="7" r="0.8" fill="black" />
        <circle cx="13.5" cy="13" r="0.8" fill="black" />
      </>
    )}
    {direction === "left" && (
      <>
        <circle cx="7" cy="7" r="1.5" fill="white" />
        <circle cx="7" cy="13" r="1.5" fill="white" />
        <circle cx="6.5" cy="7" r="0.8" fill="black" />
        <circle cx="6.5" cy="13" r="0.8" fill="black" />
      </>
    )}
    {direction === "up" && (
      <>
        <circle cx="7" cy="7" r="1.5" fill="white" />
        <circle cx="13" cy="7" r="1.5" fill="white" />
        <circle cx="7" cy="6.5" r="0.8" fill="black" />
        <circle cx="13" cy="6.5" r="0.8" fill="black" />
      </>
    )}
    {direction === "down" && (
      <>
        <circle cx="7" cy="13" r="1.5" fill="white" />
        <circle cx="13" cy="13" r="1.5" fill="white" />
        <circle cx="7" cy="13.5" r="0.8" fill="black" />
        <circle cx="13" cy="13.5" r="0.8" fill="black" />
      </>
    )}
  </svg>
)

export const SnakeBody = () => (
  <svg viewBox="0 0 20 20" className="w-full h-full">
    <defs>
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a3e635" />
        <stop offset="100%" stopColor="#84cc16" />
      </linearGradient>
    </defs>
    <circle cx="10" cy="10" r="8" fill="url(#bodyGradient)" />
  </svg>
)

export const SnakeFood = () => (
  <svg viewBox="0 0 20 20" className="w-full h-full">
    <defs>
      <radialGradient id="foodGradient">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="100%" stopColor="#ee5a6f" />
      </radialGradient>
    </defs>
    <circle cx="10" cy="10" r="7" fill="url(#foodGradient)" />
    <path d="M 10 3 Q 8 5 10 7" stroke="#4ade80" strokeWidth="1.5" fill="none" />
    <ellipse cx="9" cy="2" rx="2" ry="1" fill="#4ade80" />
  </svg>
)
