"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { PartnerCarousel } from "@/components/partner-carousel"
import { GeometricShapes } from "@/components/geometric-shapes"
import { useLanguage } from "@/contexts/language-context"
import { t } from "@/lib/i18n"

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      <GeometricShapes />
      <Navigation />

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-block mb-4 text-cyan-400 text-sm uppercase tracking-wider">
            {t("welcomeTo", language)} PixelsGames
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            we play{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">games</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">{t("heroDescription", language)}</p>
        </div>

        <div id="games" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          <Link href="/games/align-four">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-cyan-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-cyan-400 transition-colors">
                  {t("alignFour", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("alignFourDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-lg flex items-center justify-center border border-white/10">
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-white/20" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/color-clash">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-pink-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-pink-400 transition-colors">
                  {t("colorClash", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("colorClashDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-red-600/20 via-blue-600/20 to-green-600/20 rounded-lg flex items-center justify-center border border-white/10">
                  <div className="flex gap-2">
                    <div className="w-16 h-24 rounded-lg bg-red-500/40 border-2 border-white/30" />
                    <div className="w-16 h-24 rounded-lg bg-blue-500/40 border-2 border-white/30" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/word-rescue">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-green-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-green-400 transition-colors">
                  {t("wordRescue", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("wordRescueDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-white/10">
                  <div className="text-4xl font-bold text-white/80">_ _ _</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/triple-line">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-purple-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-purple-400 transition-colors">
                  {t("tripleLine", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("tripleLineDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center p-6 border border-white/10">
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square bg-white/10 rounded-lg" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/pixel-crawler">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-lime-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-lime-400 transition-colors">
                  {t("pixelCrawler", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("pixelCrawlerDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-lime-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center border border-white/10">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    <rect x="20" y="40" width="10" height="10" fill="white" opacity="0.8" />
                    <rect x="30" y="40" width="10" height="10" fill="white" opacity="0.8" />
                    <rect x="40" y="40" width="10" height="10" fill="white" opacity="0.8" />
                    <circle cx="70" cy="45" r="5" fill="#ef4444" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/number-merge">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-amber-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-amber-400 transition-colors">
                  {t("numberMerge", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("numberMergeDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg flex items-center justify-center p-4 border border-white/10">
                  <div className="grid grid-cols-4 gap-2 w-full">
                    <div className="aspect-square bg-amber-400/40 rounded flex items-center justify-center text-xl font-bold text-white">
                      2
                    </div>
                    <div className="aspect-square bg-amber-500/40 rounded flex items-center justify-center text-xl font-bold text-white">
                      4
                    </div>
                    <div className="aspect-square bg-white/10 rounded" />
                    <div className="aspect-square bg-white/10 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/sketch-guess">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-violet-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-violet-400 transition-colors">
                  {t("sketchGuess", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("sketchGuessDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 rounded-lg flex items-center justify-center border border-white/10">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    <path d="M 20 80 Q 40 20, 60 80 T 80 80" stroke="white" strokeWidth="3" fill="none" opacity="0.8" />
                    <circle cx="75" cy="25" r="3" fill="white" opacity="0.8" />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/games/hand-duel">
            <Card className="hover:scale-105 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 text-white hover:border-indigo-400/50 group">
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-indigo-400 transition-colors">
                  {t("handDuel", language)}
                </CardTitle>
                <CardDescription className="text-white/60">{t("handDuelDesc", language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-lg flex items-center justify-center gap-3 border border-white/10">
                  <div className="text-3xl opacity-80">✊</div>
                  <div className="text-3xl opacity-80">✋</div>
                  <div className="text-3xl opacity-80">✌️</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <PartnerCarousel />
      </div>
    </div>
  )
}
