import { type ColorwayConfig } from '../canvas/HeadsetMesh'

interface FeaturesProps {
  activeColorway: ColorwayConfig
}

export const Features = ({ activeColorway }: FeaturesProps) => {
  return (
    <section className="relative z-20 w-full px-4 sm:px-8 md:px-12 lg:px-20 py-20 md:py-32 bg-gradient-to-b from-transparent via-[#050608]/90 to-[#050608] backdrop-blur-md">
      {/* Subtle section glow matching active finish */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[250px] sm:h-[350px] opacity-15 blur-[120px] transition-colors duration-700"
        style={{ backgroundColor: activeColorway.hex }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col gap-2.5 sm:gap-3 mb-12 md:mb-20 text-left">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
              style={{
                backgroundColor: activeColorway.hex,
                color: activeColorway.hex,
              }}
            />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase">
              [ 03 // CORE CAPABILITIES ]
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
            ENGINEERED FOR SUPREMACY.
          </h2>

          <p className="text-xs sm:text-sm md:text-base font-mono text-neutral-400 max-w-xl leading-relaxed">
            Three core acoustic breakthroughs converging in one reference cyber-audio instrument.
          </p>
        </div>

        {/* 3-Column Minimal Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {/* ─── FEATURE 01: SPATIAL AUDIO ─── */}
          <div className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-black/50 hover:bg-black/70 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 shadow-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[360px]">
            {/* Top Graphic: Concentric Spatial Wave Indicator */}
            <div className="flex items-start justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                01 // PIPELINE
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300 group-hover:text-cyan-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="9" strokeWidth="1.2" strokeDasharray="3 3" />
                  <circle cx="12" cy="12" r="5" strokeWidth="1.2" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 sm:space-y-3 mt-8 sm:mt-12">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                360° Spherical Audio
              </h3>
              <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
                Dynamic head-tracking with ultra-low latency spatial convolution creates an expansive, millimeter-accurate acoustic sphere.
              </p>
            </div>

            {/* Bottom Spec Badge */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>LATENCY</span>
              <span className="text-white font-medium">&lt; 5.2MS AURALINK</span>
            </div>
          </div>

          {/* ─── FEATURE 02: ACTIVE NOISE CANCELLATION ─── */}
          <div className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-black/50 hover:bg-black/70 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 shadow-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[360px]">
            {/* Top Graphic: Anti-Phase Waveform */}
            <div className="flex items-start justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                02 // ISOLATION
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300 group-hover:text-emerald-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M3 12c3-6 6 6 9 0s6 6 9 0"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    d="M3 12c3 6 6-6 9 0s6-6 9 0"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 sm:space-y-3 mt-8 sm:mt-12">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                -46dB Hybrid Shield
              </h3>
              <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
                Quad-microphone array samples environmental noise at 48kHz, neutralizing low-frequency rumble and sharp transients in real time.
              </p>
            </div>

            {/* Bottom Spec Badge */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>ATTENUATION</span>
              <span className="text-white font-medium">-46DB DUAL-STAGE</span>
            </div>
          </div>

          {/* ─── FEATURE 03: MATERIALS & ERGONOMICS ─── */}
          <div className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-black/50 hover:bg-black/70 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 shadow-2xl flex flex-col justify-between min-h-[300px] sm:min-h-[360px]">
            {/* Top Graphic: Aerospace Titanium Caliper */}
            <div className="flex items-start justify-between">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                03 // CHASSIS
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300 group-hover:text-amber-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2 sm:space-y-3 mt-8 sm:mt-12">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                Titanium & Memory Foam
              </h3>
              <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
                Grade-5 anodized titanium arch paired with thermal-adaptive viscoelastic seals, distributing pressure for zero fatigue.
              </p>
            </div>

            {/* Bottom Spec Badge */}
            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>WEIGHT</span>
              <span className="text-white font-medium">248G ARCHITECTURE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
