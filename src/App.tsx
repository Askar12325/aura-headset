import { useState, useEffect } from 'react'
import { Scene } from './components/canvas/Scene'
import { Overlay } from './components/ui/Overlay'
import { Features } from './components/sections/Features'
import { TechSpecs } from './components/sections/TechSpecs'
import { FinalCTA } from './components/sections/FinalCTA'
import { COLORWAYS, type ColorwayConfig } from './components/canvas/HeadsetMesh'
import { type HotspotConfig } from './components/canvas/hotspots'

export type AudioMode = 'spatial' | 'stereo' | 'anc'

export function App() {
  const [activeColorway, setActiveColorway] = useState<ColorwayConfig>(COLORWAYS[0])
  const [audioMode, setAudioMode] = useState<AudioMode>('spatial')
  const [autoRotate, setAutoRotate] = useState<boolean>(true)
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [inFeaturesSection, setInFeaturesSection] = useState<boolean>(false)
  const [activeHotspot, setActiveHotspot] = useState<HotspotConfig | null>(null)

  // Native window scroll listener calculating deconstruction runway & features transition (RAF throttled for smooth 60/120fps scrolling)
  useEffect(() => {
    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop
        const runwayHeight = window.innerHeight * 1.4

        // Clamp deconstruction progress between 0.0 (hero) and 1.0 (fully exploded)
        const progress = Math.min(1, Math.max(0, scrollY / runwayHeight))
        setScrollProgress(progress)

        // Detect if user has scrolled past 3D Hero runway into documentation sections
        setInFeaturesSection(scrollY > runwayHeight * 0.75)

        // Dismiss hotspot focus if user begins scrolling
        if (scrollY > 40) {
          setActiveHotspot(null)
        }
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll()

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Keyboard shortcut: ESC to exit active hotspot inspection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveHotspot(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectHotspot = (hotspot: HotspotConfig | null) => {
    setActiveHotspot(hotspot)
    if (hotspot && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full bg-[#050608] min-h-screen overflow-x-hidden">
      {/* Fixed 3D Viewport in background */}
      <Scene
        activeColorway={activeColorway}
        audioMode={audioMode}
        autoRotate={autoRotate}
        scrollProgress={scrollProgress}
        activeHotspot={activeHotspot}
        onSelectHotspot={handleSelectHotspot}
      />

      {/* Fixed HUD Navigation Overlay */}
      <Overlay
        activeColorway={activeColorway}
        onSelectColorway={setActiveColorway}
        audioMode={audioMode}
        onSelectAudioMode={setAudioMode}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        scrollProgress={scrollProgress}
        onScrollToTop={handleScrollToTop}
        activeHotspot={activeHotspot}
        onSelectHotspot={handleSelectHotspot}
        inFeaturesSection={inFeaturesSection}
      />

      {/* ─── SCROLL SEQUENCE RUNWAY ─── */}
      <main className="relative w-full pointer-events-none">
        {/* Section 1 & 2: Hero & Exploded 3D Deconstruction Runway (160vh) */}
        <div className="h-[160vh] w-full pointer-events-none" />

        {/* Section 3: Core Capabilities & Features */}
        <div className="pointer-events-auto">
          <Features activeColorway={activeColorway} />
        </div>

        {/* Section 4: Technical Specifications & Precision Benchmarks */}
        <div className="pointer-events-auto">
          <TechSpecs activeColorway={activeColorway} />
        </div>

        {/* Section 5: Final CTA & Limited Allocation */}
        <div className="pointer-events-auto">
          <FinalCTA
            activeColorway={activeColorway}
            onScrollToTop={handleScrollToTop}
          />
        </div>
      </main>
    </div>
  )
}

export default App
