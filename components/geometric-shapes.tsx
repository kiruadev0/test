"use client"

import { useEffect, useState } from "react"

interface Shape {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
  type: "pentagon" | "circle" | "blob"
}

export function GeometricShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    const newShapes: Shape[] = []
    const colors = ["from-cyan-400 to-cyan-300", "from-pink-400 to-pink-300", "from-green-400 to-green-300"]
    const types: Shape["type"][] = ["pentagon", "circle", "blob"]

    for (let i = 0; i < 8; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 150 + 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        type: types[Math.floor(Math.random() * types.length)],
      })
    }
    setShapes(newShapes)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`absolute bg-gradient-to-br ${shape.color} opacity-20 blur-sm animate-float`}
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            transform: `rotate(${shape.rotation}deg)`,
            clipPath:
              shape.type === "pentagon"
                ? "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"
                : shape.type === "circle"
                  ? "circle(50%)"
                  : "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            animationDelay: `${shape.id * 0.5}s`,
            animationDuration: `${15 + shape.id * 2}s`,
          }}
        />
      ))}
    </div>
  )
}
