"use client"

import Link from "next/link"
import { useState } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Users } from "lucide-react"

const partners = [
  "TechCorp",
  "GameStudio",
  "PixelWorks",
  "CodeLabs",
  "DigitalArts",
  "InnovateTech",
  "CreativeMinds",
  "FutureGames",
]

export function Navigation() {
  const { language } = useLanguage()
  const [showMultiplayerGuide, setShowMultiplayerGuide] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center">
              <span className="text-white font-bold text-xl">PG</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">PixelsGames</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/#games">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                {t("games", language)}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  {t("partners", language)} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-sm border-white/20">
                {partners.map((partner) => (
                  <DropdownMenuItem key={partner} className="text-white hover:bg-white/10">
                    {partner}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setShowMultiplayerGuide(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              {t("howToPlay", language)}
            </Button>

            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {showMultiplayerGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowMultiplayerGuide(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-white mb-6">{t("howToPlayWithFriends", language)}</h2>
            <div className="space-y-4 text-white/90">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-bold text-cyan-400 mb-2">1. {t("selectGame", language)}</h3>
                <p>{t("selectGameDesc", language)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-bold text-pink-400 mb-2">2. {t("chooseOnlineMode", language)}</h3>
                <p>{t("chooseOnlineModeDesc", language)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-bold text-green-400 mb-2">3. {t("createOrJoin", language)}</h3>
                <p>{t("createOrJoinDesc", language)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="font-bold text-purple-400 mb-2">4. {t("shareCode", language)}</h3>
                <p>{t("shareCodeDesc", language)}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowMultiplayerGuide(false)}
              className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white"
            >
              {t("gotIt", language)}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
