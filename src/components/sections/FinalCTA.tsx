import { useState } from 'react'
import { type ColorwayConfig } from '../canvas/HeadsetMesh'

interface FinalCTAProps {
  activeColorway: ColorwayConfig
  onScrollToTop: () => void
}

export const FinalCTA = ({ activeColorway, onScrollToTop }: FinalCTAProps) => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubmitted(true)
    }
  }

  return (
    <section className="relative z-20 w-full px-4 sm:px-8 md:px-12 lg:px-20 pt-20 md:pt-32 pb-12 md:pb-16 bg-[#050608] border-t border-white/[0.06] overflow-hidden">
      {/* Dynamic atmospheric radial backdrop */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[250px] sm:h-[400px] opacity-15 blur-[160px] transition-colors duration-700"
        style={{ backgroundColor: activeColorway.hex }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <span
            className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
            style={{
              backgroundColor: activeColorway.hex,
              color: activeColorway.hex,
            }}
          />
          <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.3em] text-neutral-400 uppercase">
            [ 05 // LIMITED ALLOCATION ]
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-sans mb-4 sm:mb-6">
          HEAR THE UNSEEN.
        </h2>

        {/* Supporting Sentence */}
        <p className="text-xs sm:text-sm md:text-base font-mono text-neutral-400 max-w-lg mb-8 sm:mb-12 leading-relaxed">
          Initial production run strictly limited to 500 numbered units. Individually bench-calibrated before dispatch.
        </p>

        {/* Primary Action Form */}
        <div className="w-full max-w-md mb-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER WORK EMAIL"
                className="w-full min-h-[48px] px-5 py-3 rounded-full border border-white/[0.12] bg-black/60 backdrop-blur-xl text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/40 transition-colors shadow-xl"
              />
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-6 sm:px-7 py-3 rounded-full text-xs font-mono tracking-widest uppercase font-bold text-black transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: activeColorway.hex }}
              >
                <span>RESERVE ALLOCATION</span>
                <span>→</span>
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ALLOCATION RESERVED // CONFIRMATION DISPATCHED TO {email.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Secondary Metadata */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase tracking-wider sm:tracking-widest mb-16 sm:mb-28 text-center">
          <span>Batch 01 · 500 Units</span>
          <span>·</span>
          <span>Complimentary Global Freight</span>
          <span>·</span>
          <span>Q1 2027 Delivery</span>
        </div>

        {/* Minimal Site Ending & Footer */}
        <div className="w-full pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-500 text-center sm:text-left">
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="font-bold text-white tracking-widest uppercase">AURA</span>
            <span>//</span>
            <span>CYBER-ACOUSTICS LABS</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <span>TOKYO</span>
            <span>·</span>
            <span>SAN FRANCISCO</span>
            <span>·</span>
            <span>ZURICH</span>
          </div>

          <button
            onClick={onScrollToTop}
            className="min-h-[44px] sm:min-h-0 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-widest group"
          >
            <span>BACK TO TOP</span>
            <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>
        </div>
      </div>
    </section>
  )
}
