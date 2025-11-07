"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/i18n"
import { partners } from "@/lib/partners-config"
import Image from "next/image"

export function PartnerCarousel() {
  const { language } = useLanguage()
  const t = translations[language]
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % (partners.length * 200))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const infinitePartners = [...partners, ...partners, ...partners]

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-cyan-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-sm py-12 border-y border-white/10">
      <h3 className="text-center text-white/80 text-sm uppercase tracking-wider mb-8 font-semibold">
        {t.ourPartners || "Our Partners"}
      </h3>
      <div className="relative">
        <div
          className="flex gap-16 transition-transform"
          style={{
            transform: `translateX(-${offset}px)`,
            width: `${infinitePartners.length * 200}px`,
          }}
        >
          {infinitePartners.map((partner, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-40 h-40 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="relative w-32 h-32">
                <Image
                  src={partner.image || "/placeholder.svg"}
                  alt={partner.name}
                  fill
                  className="object-contain p-4"
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `<span class="text-3xl font-bold text-white">${partner.name.substring(0, 2).toUpperCase()}</span>`
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
