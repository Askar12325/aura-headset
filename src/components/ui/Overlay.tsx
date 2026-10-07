import { type ColorwayConfig, COLORWAYS, type AudioMode } from '../canvas/HeadsetMesh'
import { type HotspotConfig } from '../canvas/hotspots'

interface OverlayProps {
  activeColorway: ColorwayConfig
  onSelectColorway: (colorway: ColorwayConfig) => void
  audioMode: AudioMode
  onSelectAudioMode: (mode: AudioMode) => void
  autoRotate: boolean
  onToggleAutoRotate: () => void
  scrollProgress: number
  onScrollToTop: () => void
  activeHotspot: HotspotConfig | null
  onSelectHotspot: (hotspot: HotspotConfig | null) => void
  inFeaturesSection?: boolean
}

export const Overlay = ({
  activeColorway,
  onSelectColorway,
  audioMode,
  onSelectAudioMode,
  autoRotate,
  onToggleAutoRotate,
  scrollProgress,
  onScrollToTop,
  activeHotspot,
  onSelectHotspot,
  inFeaturesSection = false,
}: OverlayProps) => {

  // Smooth opacity curves based on scroll progress and hotspot state
  const isInspectingHotspot = activeHotspot !== null
  const heroOpacity = (isInspectingHotspot || inFeaturesSection)
    ? 0
    : Math.max(0, Math.min(1, 1 - (scrollProgress - 0.12) / 0.22))
  const explodedOpacity = (isInspectingHotspot || inFeaturesSection)
    ? 0
    : Math.max(0, Math.min(1, (scrollProgress - 0.25) / 0.25))
  const footerOpacity = inFeaturesSection ? 0 : 1

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 select-none overflow-hidden font-sans">
      {/* ─── TOP BAR ─── */}
      <header className="flex items-center justify-between w-full">
        {/* Brand Minimal Lockup */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-colors duration-500 shadow-[0_0_8px_currentColor]"
            style={{
              backgroundColor: activeColorway.hex,
              color: activeColorway.hex,
            }}
          />
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-lg sm:text-xl font-black tracking-[0.2em] sm:tracking-[0.24em] text-white uppercase">
              AURA
            </span>
            <span className="text-neutral-500 font-extralight text-[10px] sm:text-xs tracking-widest">
              //
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.18em] sm:tracking-[0.22em] text-neutral-400 uppercase">
              SPATIAL-01
            </span>
          </div>
        </div>

        {/* Audio Mode Selector & Real-Time Telemetry */}
        <div className="flex flex-col items-end gap-1.5 sm:gap-2">
          <div className="pointer-events-auto flex items-center p-1 rounded-full border border-white/[0.12] bg-black/60 backdrop-blur-xl shadow-2xl">
            {(
              [
                { id: 'spatial', label: 'SPATIAL', sub: '360°' },
                { id: 'stereo', label: 'STEREO', sub: 'PURE' },
                { id: 'anc', label: 'ANC', sub: 'NULL' },
              ] as const
            ).map((mode) => {
              const isSelected = audioMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectAudioMode(mode.id)}
                  className={`group relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 min-h-[38px] sm:min-h-0 text-[9px] sm:text-[10px] font-mono tracking-widest rounded-full transition-all duration-300 ${
                    isSelected
                      ? mode.id === 'spatial'
                        ? 'text-white bg-white/[0.18] font-bold shadow-[0_0_16px_rgba(0,240,255,0.3)] border border-white/25'
                        : mode.id === 'anc'
                        ? 'text-white bg-white/[0.12] font-bold border border-white/30 shadow-[0_0_12px_rgba(0,0,0,0.9)]'
                        : 'text-white bg-white/[0.14] font-semibold border border-white/20 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isSelected
                        ? mode.id === 'spatial'
                          ? 'scale-125 animate-pulse shadow-[0_0_10px_currentColor]'
                          : 'scale-110 shadow-[0_0_6px_currentColor]'
                        : 'opacity-40 group-hover:opacity-75'
                    }`}
                    style={{
                      backgroundColor: isSelected ? activeColorway.hex : '#64748b',
                      color: activeColorway.hex,
                    }}
                  />
                  <span>{mode.label}</span>
                </button>
              )
            })}
          </div>

          {/* Micro Telemetry Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/[0.08] backdrop-blur-md text-[9px] font-mono tracking-wider shadow-lg">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                audioMode === 'spatial'
                  ? 'animate-ping'
                  : audioMode === 'anc'
                  ? 'opacity-40'
                  : ''
              }`}
              style={{ backgroundColor: activeColorway.hex }}
            />
            <span className="text-neutral-300 font-medium">
              {audioMode === 'spatial' && 'SPATIAL // 360° SPHERICAL SOUNDSTAGE'}
              {audioMode === 'stereo' && 'STEREO // BIT-PERFECT DIRECT REFERENCE'}
              {audioMode === 'anc' && 'ANC // -46dB ACOUSTIC NULL SHIELD'}
            </span>
          </div>
        </div>
      </header>

      {/* ─── LEFT MINIMAL HUD (HERO STATE) ─── */}
      <div
        className="self-start my-auto hidden lg:flex flex-col gap-2 max-w-[210px] transition-all duration-500"
        style={{
          opacity: heroOpacity,
          transform: `translateX(${(1 - heroOpacity) * -15}px)`,
          pointerEvents: heroOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="p-3.5 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-white/[0.06]">
            <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
              SPEC // 01
            </span>
            {/* Dynamic 5-bar live equalizer reacting dramatically to audioMode */}
            <div className="flex items-end gap-0.5 h-3">
              <span
                className={`w-[1.5px] bg-neutral-400 rounded-full transition-all duration-500 ${
                  audioMode === 'spatial'
                    ? 'animate-[pulse_0.7s_ease-in-out_infinite]'
                    : audioMode === 'anc'
                    ? 'opacity-20'
                    : ''
                }`}
                style={{ height: audioMode === 'spatial' ? '70%' : audioMode === 'anc' ? '12%' : '45%' }}
              />
              <span
                className={`w-[1.5px] rounded-full transition-all duration-500 ${
                  audioMode === 'spatial'
                    ? 'animate-[pulse_0.5s_ease-in-out_infinite]'
                    : audioMode === 'anc'
                    ? 'opacity-20'
                    : ''
                }`}
                style={{
                  height: audioMode === 'spatial' ? '100%' : audioMode === 'anc' ? '15%' : '50%',
                  backgroundColor: activeColorway.hex,
                }}
              />
              <span
                className={`w-[1.5px] bg-neutral-400 rounded-full transition-all duration-500 ${
                  audioMode === 'spatial'
                    ? 'animate-[pulse_0.9s_ease-in-out_infinite]'
                    : audioMode === 'anc'
                    ? 'opacity-20'
                    : ''
                }`}
                style={{ height: audioMode === 'spatial' ? '85%' : audioMode === 'anc' ? '10%' : '40%' }}
              />
              <span
                className={`w-[1.5px] rounded-full transition-all duration-500 ${
                  audioMode === 'spatial'
                    ? 'animate-[pulse_0.6s_ease-in-out_infinite]'
                    : audioMode === 'anc'
                    ? 'opacity-20'
                    : ''
                }`}
                style={{
                  height: audioMode === 'spatial' ? '90%' : audioMode === 'anc' ? '12%' : '55%',
                  backgroundColor: activeColorway.hex,
                }}
              />
              <span
                className={`w-[1.5px] bg-neutral-400 rounded-full transition-all duration-500 ${
                  audioMode === 'spatial'
                    ? 'animate-[pulse_1.1s_ease-in-out_infinite]'
                    : audioMode === 'anc'
                    ? 'opacity-20'
                    : ''
                }`}
                style={{ height: audioMode === 'spatial' ? '60%' : audioMode === 'anc' ? '8%' : '35%' }}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] font-mono">
            <div className="flex justify-between items-center text-neutral-400">
              <span>DRIVER</span>
              <span className="text-neutral-200">40mm Beryllium</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>DSP STAGE</span>
              <span className="text-neutral-200 font-semibold uppercase" style={{ color: activeColorway.hex }}>
                {audioMode === 'spatial' ? '360° SPATIAL' : audioMode === 'stereo' ? 'DIRECT 2.0' : '-46dB NULL'}
              </span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>LATENCY</span>
              <span className="text-neutral-200">&lt; 5.2ms RF</span>
            </div>
            <div className="flex justify-between items-center text-neutral-400">
              <span>CHASSIS</span>
              <span className="text-neutral-200">Space Black Ti</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ACTIVE HOTSPOT DETAIL CARD (MODAL / DOCKED AT BOTTOM ON MOBILE) ─── */}
      {activeHotspot && (
        <div className="fixed sm:static bottom-24 inset-x-4 sm:inset-x-auto sm:self-end sm:my-auto mr-0 md:mr-4 max-w-sm w-auto sm:w-full transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 z-40">
          <div className="pointer-events-auto p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/85 backdrop-blur-2xl shadow-2xl flex flex-col gap-2.5 sm:gap-3">
            {/* Header: Tag + Close button */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                  style={{
                    backgroundColor: activeColorway.hex,
                    color: activeColorway.hex,
                  }}
                />
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  {activeHotspot.number} // {activeHotspot.tag}
                </span>
              </div>
              <button
                onClick={() => onSelectHotspot(null)}
                className="w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-white bg-white/5 sm:bg-transparent hover:bg-white/10 transition-colors text-xs font-mono"
                title="Close focus [ESC]"
                aria-label="Close focus"
              >
                ✕
              </button>
            </div>

            {/* Title & Spec */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                {activeHotspot.title}
              </h3>
              <p
                className="text-[10px] sm:text-[11px] font-mono tracking-wide mt-0.5"
                style={{ color: activeColorway.hex }}
              >
                {activeHotspot.spec}
              </p>
            </div>

            {/* Description */}
            <p className="text-[10px] sm:text-[11px] font-sans text-neutral-300 leading-relaxed">
              {activeHotspot.detail}
            </p>

            {/* Footer action */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-[9px] sm:text-[10px] font-mono text-neutral-400">
              <span className="hidden sm:inline">ESC TO EXIT FOCUS</span>
              <button
                onClick={() => onSelectHotspot(null)}
                className="min-h-[38px] sm:min-h-0 text-white transition-opacity hover:opacity-80 uppercase font-medium flex items-center gap-1 group py-1"
                style={{ color: activeColorway.hex }}
              >
                <span>RETURN TO HERO</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── LEFT MINIMAL EXPLODED INDICATOR (ACTIVE ON SCROLL) ─── */}
      <div
        className="self-start my-auto hidden lg:flex flex-col gap-2 transition-all duration-500 absolute left-8 lg:left-10"
        style={{
          opacity: explodedOpacity,
          transform: `translateX(${(1 - explodedOpacity) * -15}px)`,
          pointerEvents: explodedOpacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <button
          onClick={onScrollToTop}
          className="pointer-events-auto px-3.5 py-1.5 rounded-full border border-white/10 bg-black/60 hover:bg-neutral-900/80 backdrop-blur-xl text-[10px] font-mono tracking-widest text-neutral-300 uppercase flex items-center gap-2 group shadow-xl transition-all"
        >
          <span
            className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
            style={{ backgroundColor: activeColorway.hex, color: activeColorway.hex }}
          />
          <span>DECONSTRUCTED // 4 STAGES</span>
          <span className="text-neutral-500 group-hover:text-white transition-colors">↑</span>
        </button>
      </div>

      {/* ─── BOTTOM CONTROLS & SWATCH DOCK ─── */}
      <footer
        className="w-full flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pt-3 border-t border-white/[0.06] transition-opacity duration-500"
        style={{
          opacity: footerOpacity,
          pointerEvents: footerOpacity === 1 ? 'auto' : 'none',
        }}
      >
        {/* Minimal Scroll Cue / Hotspot Cue */}
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-mono text-neutral-400 tracking-wider sm:tracking-widest uppercase">
          {isInspectingHotspot ? (
            <button
              onClick={() => onSelectHotspot(null)}
              className="pointer-events-auto min-h-[38px] sm:min-h-0 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>← Back to product inspection</span>
            </button>
          ) : (
            <>
              <span className="inline-block transition-transform duration-300">
                {scrollProgress > 0.15 ? '↑' : '↓'}
              </span>
              <span>
                {scrollProgress > 0.15 ? 'Scroll to reassemble' : 'Tap pins to inspect · Scroll to deconstruct'}
              </span>
            </>
          )}
        </div>

        {/* Center / Right Dock: Swatches + Turntable */}
        <div className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Minimal Color Swatches */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full border border-white/[0.08] bg-black/50 backdrop-blur-xl shadow-xl transition-opacity duration-300"
            style={{ opacity: Math.max(0.4, heroOpacity) }}
          >
            {COLORWAYS.map((c) => {
              const isSelected = activeColorway.id === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectColorway(c)}
                  className={`group relative flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1 min-h-[44px] sm:min-h-0 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/[0.12] text-white shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  title={`${c.name} (${c.hex})`}
                  aria-label={`Select ${c.name} finish`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'scale-110 shadow-[0_0_6px_currentColor]'
                        : 'opacity-60 group-hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: c.id === 'space-black' ? '#111317' : c.hex,
                      borderColor: c.id === 'space-black' ? '#00f0ff' : 'transparent',
                      borderWidth: c.id === 'space-black' ? '1.5px' : '0px',
                      color: c.hex,
                    }}
                  />
                  {isSelected && (
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-medium">
                      {c.name}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Minimal Turntable Toggle */}
          <button
            onClick={onToggleAutoRotate}
            className="flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-full border border-white/[0.08] bg-black/50 hover:bg-black/70 backdrop-blur-xl text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-neutral-300 transition-all shadow-xl"
            title="Toggle turntable auto-rotation"
            aria-label="Toggle turntable auto-rotation"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                autoRotate && !isInspectingHotspot
                  ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                  : 'bg-neutral-600'
              }`}
            />
            <span className="inline">
              {autoRotate && !isInspectingHotspot ? 'TURNTABLE' : 'PAUSED'}
            </span>
          </button>
        </div>
      </footer>
    </div>
  )
}
