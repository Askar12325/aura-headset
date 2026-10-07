import { Html } from '@react-three/drei'
import { HOTSPOTS, type HotspotConfig } from './hotspots'

interface HotspotMarkersProps {
  color: string
  activeHotspot: HotspotConfig | null
  onSelectHotspot: (hotspot: HotspotConfig | null) => void
  scrollProgress: number
}

export const HotspotMarkers = ({
  color,
  activeHotspot,
  onSelectHotspot,
  scrollProgress,
}: HotspotMarkersProps) => {
  // Fade out hotspots if user scrolls or if a hotspot is currently selected
  const isVisible = scrollProgress < 0.12 && activeHotspot === null
  const opacity = isVisible ? 1 : 0

  if (!isVisible) return null

  return (
    <group>
      {HOTSPOTS.map((spot) => (
        <Html
          key={spot.id}
          position={spot.position}
          center
          distanceFactor={5.5}
          zIndexRange={[9999, 1000]}
        >
          <div
            className="pointer-events-auto transition-opacity duration-300 select-none"
            style={{ opacity }}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
            }}
          >
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
              }}
              onPointerUp={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                onSelectHotspot(spot)
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                onSelectHotspot(spot)
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
                onSelectHotspot(spot)
              }}
              className="group relative flex items-center justify-center w-11 h-11 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] cursor-pointer focus:outline-none -m-1 sm:m-0"
              title={`Inspect ${spot.title}`}
              aria-label={`Inspect ${spot.title}`}
            >
              {/* Outer subtle breathing beacon */}
              <span
                className="absolute w-5 h-5 rounded-full opacity-40 animate-ping pointer-events-none"
                style={{ backgroundColor: color }}
              />

              {/* Inner high-contrast cyber pin */}
              <span
                className="relative flex items-center justify-center w-3.5 h-3.5 rounded-full border border-white/70 bg-black/90 shadow-[0_0_12px_currentColor] transition-all duration-300 group-hover:scale-125 group-hover:border-white"
                style={{ color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                  style={{ backgroundColor: color }}
                />
              </span>

              {/* Hover Tooltip Capsule (Desktop only) */}
              <span className="hidden sm:block absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap text-[9px] font-mono tracking-widest text-white/95 bg-black/90 px-2.5 py-1 rounded-full border border-white/20 shadow-2xl backdrop-blur-md">
                {spot.number} // {spot.shortName}
              </span>
            </button>
          </div>
        </Html>
      ))}
    </group>
  )
}
