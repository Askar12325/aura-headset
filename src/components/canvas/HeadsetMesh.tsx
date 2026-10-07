import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export interface ColorwayConfig {
  id: string
  name: string
  hex: string
  chassisHex: string
  accentHex: string
  chromeHex: string
  roughness: number
  metalness: number
  description: string
}

export const COLORWAYS: ColorwayConfig[] = [
  {
    id: 'space-black',
    name: 'Space Black',
    hex: '#00f0ff',
    chassisHex: '#0a0b0e',
    accentHex: '#14161f',
    chromeHex: '#1c202a',
    roughness: 0.65,
    metalness: 0.15,
    description: 'Matte obsidian Space Black with cyber-cyan telemetry',
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    hex: '#ff9e00',
    chassisHex: '#0c0a08',
    accentHex: '#1a1612',
    chromeHex: '#25201a',
    roughness: 0.65,
    metalness: 0.15,
    description: 'Matte obsidian with molten solar ember luminescence',
  },
  {
    id: 'purple',
    name: 'Ultraviolet',
    hex: '#b026ff',
    chassisHex: '#0b0912',
    accentHex: '#181324',
    chromeHex: '#241c36',
    roughness: 0.65,
    metalness: 0.15,
    description: 'Midnight violet alloy with radiant ultraviolet resonance',
  },
  {
    id: 'emerald',
    name: 'Hyper Emerald',
    hex: '#00ff9d',
    chassisHex: '#080d0b',
    accentHex: '#111d17',
    chromeHex: '#182b20',
    roughness: 0.65,
    metalness: 0.15,
    description: 'Stealth biomechanical carbon with phosphor emerald telemetry',
  },
  {
    id: 'lunar',
    name: 'Lunar White',
    hex: '#ffffff',
    chassisHex: '#c8cbd4',
    accentHex: '#9499a6',
    chromeHex: '#e2e5eb',
    roughness: 0.38,
    metalness: 0.65,
    description: 'Reference laboratory grade with 6500K calibrated white beam',
  },
]

import { HotspotMarkers } from './HotspotMarkers'
import { type HotspotConfig } from './hotspots'

export type AudioMode = 'spatial' | 'stereo' | 'anc'

interface HeadsetMeshProps {
  activeColorway: ColorwayConfig
  audioMode?: AudioMode
  autoRotate?: boolean
  scrollProgress?: number
  activeHotspot?: HotspotConfig | null
  onSelectHotspot?: (hotspot: HotspotConfig | null) => void
}

// 3D Callout Card Component (Minimal & Surgical)
const CalloutBadge = ({
  number,
  title,
  opacity,
  color,
}: {
  number: string
  title: string
  opacity: number
  color: string
}) => {
  return (
    <div
      className="pointer-events-none transition-opacity duration-300 select-none whitespace-nowrap"
      style={{
        opacity,
        transform: `scale(${0.92 + opacity * 0.08})`,
      }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/75 backdrop-blur-xl shadow-2xl">
        <span
          className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: color, color }}
        />
        <span className="text-[10px] font-mono tracking-widest text-white/90 uppercase font-semibold">
          {number} // {title}
        </span>
      </div>
    </div>
  )
}

export const HeadsetMesh = ({
  activeColorway,
  audioMode = 'spatial',
  autoRotate = true,
  scrollProgress = 0,
  activeHotspot,
  onSelectHotspot,
}: HeadsetMeshProps) => {
  const rootGroupRef = useRef<THREE.Group>(null)
  const autoYawRef = useRef(0)
  const smoothedProgress = useRef(0)

  // Sub-component group references for exploded translations
  const headbandGroupRef = useRef<THREE.Group>(null)
  const rightOuterDomeRef = useRef<THREE.Group>(null)
  const rightLedHaloRef = useRef<THREE.Group>(null)
  const rightDriverCoreRef = useRef<THREE.Group>(null)
  const rightCushionRef = useRef<THREE.Group>(null)
  const leftCupGroupRef = useRef<THREE.Group>(null)

  // Color & PBR interpolation trackers
  const currentLedColor = useRef(new THREE.Color(activeColorway.hex))
  const currentEmissiveIntensity = useRef(5.5)
  const currentChassisColor = useRef(new THREE.Color(activeColorway.chassisHex))
  const currentAccentColor = useRef(new THREE.Color(activeColorway.accentHex))
  const currentChromeColor = useRef(new THREE.Color(activeColorway.chromeHex))
  const currentRoughness = useRef(activeColorway.roughness)
  const currentMetalness = useRef(activeColorway.metalness)

  // Stable physical materials
  const materials = useMemo(() => {
    return {
      chassis: new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColorway.chassisHex),
        roughness: activeColorway.roughness,
        metalness: activeColorway.metalness,
        envMapIntensity: 0.35,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColorway.accentHex),
        roughness: 0.5,
        metalness: 0.25,
        envMapIntensity: 0.45,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColorway.chromeHex),
        roughness: 0.4,
        metalness: 0.3,
        envMapIntensity: 0.55,
      }),
      cushion: new THREE.MeshStandardMaterial({
        color: '#050608',
        roughness: 0.92,
        metalness: 0.02,
      }),
      acousticMesh: new THREE.MeshStandardMaterial({
        color: '#030405',
        roughness: 0.88,
        metalness: 0.05,
      }),
      led: new THREE.MeshStandardMaterial({
        color: new THREE.Color(activeColorway.hex),
        emissive: new THREE.Color(activeColorway.hex),
        emissiveIntensity: 5.5,
        toneMapped: false,
        roughness: 0.05,
      }),
      // Internal audio components revealed in exploded view
      driverGold: new THREE.MeshStandardMaterial({
        color: '#d97706',
        roughness: 0.25,
        metalness: 0.85,
        envMapIntensity: 1.4,
      }),
      voiceCoil: new THREE.MeshStandardMaterial({
        color: '#b45309',
        roughness: 0.2,
        metalness: 0.95,
        envMapIntensity: 1.6,
      }),
      magnet: new THREE.MeshStandardMaterial({
        color: '#1a1d26',
        roughness: 0.28,
        metalness: 0.92,
        envMapIntensity: 1.2,
      }),
    }
  }, [])

  const targetValues = useMemo(() => ({
    led: new THREE.Color(activeColorway.hex),
    chassis: new THREE.Color(activeColorway.chassisHex),
    accent: new THREE.Color(activeColorway.accentHex),
    chrome: new THREE.Color(activeColorway.chromeHex),
    roughness: activeColorway.roughness,
    metalness: activeColorway.metalness,
  }), [activeColorway])

  // Precision 60fps frame loop: disassembly lerp + floating animation
  useFrame((state, delta) => {
    // 1. Smoothly interpolate colors
    const lerpRate = Math.min(delta * 5.2, 1.0)
    currentLedColor.current.lerp(targetValues.led, lerpRate)
    currentChassisColor.current.lerp(targetValues.chassis, lerpRate)
    currentAccentColor.current.lerp(targetValues.accent, lerpRate)
    currentChromeColor.current.lerp(targetValues.chrome, lerpRate)
    currentRoughness.current = THREE.MathUtils.lerp(currentRoughness.current, targetValues.roughness, lerpRate)
    currentMetalness.current = THREE.MathUtils.lerp(currentMetalness.current, targetValues.metalness, lerpRate)

    // Modulate LED emissive intensity with dramatic contrast based on active Audio Mode
    const t = state.clock.getElapsedTime()
    let targetEmissive = 4.6 // STEREO: calibrated clean reference constant (pure, stable, zero pulse)
    if (audioMode === 'spatial') {
      // SPATIAL: dramatic, wide, breathing spatial acoustic bloom (6.2 - 13.4 range)
      targetEmissive = 9.8 + Math.sin(t * 3.4) * 3.6
    } else if (audioMode === 'anc') {
      // ANC: razor-sharp, ultra-concentrated high-contrast laser beam in pitch void
      targetEmissive = 11.5
    }
    currentEmissiveIntensity.current = THREE.MathUtils.lerp(
      currentEmissiveIntensity.current,
      targetEmissive,
      Math.min(delta * 4.5, 1.0)
    )

    materials.led.color.copy(currentLedColor.current)
    materials.led.emissive.copy(currentLedColor.current)
    materials.led.emissiveIntensity = currentEmissiveIntensity.current
    materials.chassis.color.copy(currentChassisColor.current)
    materials.chassis.roughness = currentRoughness.current
    materials.chassis.metalness = currentMetalness.current
    materials.accent.color.copy(currentAccentColor.current)
    materials.chrome.color.copy(currentChromeColor.current)

    // 2. Smoothly damp scroll progress
    smoothedProgress.current = THREE.MathUtils.lerp(
      smoothedProgress.current,
      scrollProgress,
      Math.min(delta * 5.5, 1.0)
    )
    const p = smoothedProgress.current

    // 3. Exploded view disassembly transforms
    // Headband elevates upward
    if (headbandGroupRef.current) {
      headbandGroupRef.current.position.y = 0.48 + p * 0.42
    }

    // Right Ear Cup disassembly (our hero inspection target):
    // Outer Chassis Dome moves outward (+X)
    if (rightOuterDomeRef.current) {
      rightOuterDomeRef.current.position.x = p * 0.72
      rightOuterDomeRef.current.rotation.y = -0.16 + p * 0.14
    }

    // LED Halo Ring & Medallion moves even further outward (+X)
    if (rightLedHaloRef.current) {
      rightLedHaloRef.current.position.x = 0.17 + p * 1.15
    }

    // Transducer Core (40mm Beryllium driver + voice coil) floats in middle
    if (rightDriverCoreRef.current) {
      rightDriverCoreRef.current.position.x = p * 0.18
      rightDriverCoreRef.current.rotation.y = -0.16 + p * 0.08
    }

    // Memory-Foam Cushion moves inward (-X)
    if (rightCushionRef.current) {
      rightCushionRef.current.position.x = -0.185 - p * 0.65
      rightCushionRef.current.rotation.y = -0.16 - p * 0.08
    }

    // Left ear cup subtly moves outward (-X) to balance frame
    if (leftCupGroupRef.current) {
      leftCupGroupRef.current.position.x = -1.29 - p * 0.35
    }

    // 4. Subtle floating poise (dampened when exploded for stable inspection)
    if (!rootGroupRef.current) return
    const floatDamp = 1.0 - p * 0.75 // Calmer float when exploded

    const hoverY = Math.sin(t * 0.7) * (0.04 * floatDamp)
    rootGroupRef.current.position.y = THREE.MathUtils.lerp(
      rootGroupRef.current.position.y,
      hoverY,
      0.08
    )

    const pitch = Math.sin(t * 0.52) * (0.018 * floatDamp)
    const roll = Math.cos(t * 0.42) * (0.012 * floatDamp)
    rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.x,
      pitch,
      0.08
    )
    rootGroupRef.current.rotation.z = THREE.MathUtils.lerp(
      rootGroupRef.current.rotation.z,
      roll,
      0.08
    )

    // Auto turntable rotation: active at top, smoothly pauses as disassembly begins
    if (autoRotate && p < 0.08) {
      autoYawRef.current += delta * 0.18
      rootGroupRef.current.rotation.y = autoYawRef.current
    } else {
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        0,
        0.06
      )
      autoYawRef.current = rootGroupRef.current.rotation.y
    }
  })

  // Label opacity fades in as disassembly reaches inspection threshold
  const labelOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.35) / 0.35))

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Interactive 3D Hotspot Pins (Tracking synchronously with headset turntable poise) */}
      {onSelectHotspot && (
        <HotspotMarkers
          color={activeColorway.hex}
          activeHotspot={activeHotspot ?? null}
          onSelectHotspot={onSelectHotspot}
          scrollProgress={scrollProgress}
        />
      )}

      {/* ─── HEADBAND ARCHITECTURE ─── */}
      <group ref={headbandGroupRef} position={[0, 0.48, 0]}>
        {/* Floating Callout: Headband */}
        <Html
          position={[0, 1.48, 0]}
          center
          distanceFactor={5.5}
          zIndexRange={[100, 0]}
        >
          <CalloutBadge
            number="01"
            title="TITANIUM ARCH"
            opacity={labelOpacity}
            color={activeColorway.hex}
          />
        </Html>

        {/* Primary spine arch (Matte Space Black) */}
        <mesh rotation={[0, 0, 0]} material={materials.chassis}>
          <torusGeometry args={[1.22, 0.058, 32, 80, Math.PI]} />
        </mesh>

        {/* Secondary structural rib (dark smoked trim) */}
        <mesh position={[0, 0.02, 0]} material={materials.chrome}>
          <torusGeometry args={[1.25, 0.018, 16, 80, Math.PI]} />
        </mesh>

        {/* Inner comfort cushion with segmented memory-foam profile */}
        <mesh position={[0, -0.038, 0]} material={materials.cushion}>
          <torusGeometry args={[1.16, 0.05, 24, 60, Math.PI * 0.76]} />
        </mesh>

        {/* Micro brand center index */}
        <mesh position={[0, 1.25, 0]} material={materials.chrome}>
          <boxGeometry args={[0.09, 0.012, 0.07]} />
        </mesh>

        {/* Left Extension Slider */}
        <group position={[-1.22, 0, 0]}>
          <mesh position={[0, -0.16, 0]} material={materials.chrome}>
            <cylinderGeometry args={[0.068, 0.068, 0.34, 32]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={materials.accent}>
            <cylinderGeometry args={[0.082, 0.082, 0.06, 32]} />
          </mesh>
          <mesh position={[0, -0.34, 0]} material={materials.chassis}>
            <boxGeometry args={[0.18, 0.11, 0.19]} />
          </mesh>
          <mesh position={[0, -0.44, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.accent}>
            <cylinderGeometry args={[0.07, 0.07, 0.2, 32]} />
          </mesh>
        </group>

        {/* Right Extension Slider */}
        <group position={[1.22, 0, 0]}>
          <mesh position={[0, -0.16, 0]} material={materials.chrome}>
            <cylinderGeometry args={[0.068, 0.068, 0.34, 32]} />
          </mesh>
          <mesh position={[0, -0.04, 0]} material={materials.accent}>
            <cylinderGeometry args={[0.082, 0.082, 0.06, 32]} />
          </mesh>
          <mesh position={[0, -0.34, 0]} material={materials.chassis}>
            <boxGeometry args={[0.18, 0.11, 0.19]} />
          </mesh>
          <mesh position={[0, -0.44, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.accent}>
            <cylinderGeometry args={[0.07, 0.07, 0.2, 32]} />
          </mesh>
        </group>
      </group>

      {/* ─── LEFT EAR CUP ASSEMBLY ─── */}
      <group ref={leftCupGroupRef} position={[-1.29, -0.14, 0]} rotation={[0.06, 0.16, 0.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={materials.chassis}>
          <cylinderGeometry args={[0.57, 0.59, 0.28, 64]} />
        </mesh>
        <mesh position={[-0.145, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.accent}>
          <cylinderGeometry args={[0.49, 0.54, 0.04, 64]} />
        </mesh>
        <mesh position={[-0.17, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.led}>
          <torusGeometry args={[0.39, 0.024, 24, 80]} />
        </mesh>
        <mesh position={[-0.175, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.chassis}>
          <cylinderGeometry args={[0.24, 0.24, 0.025, 48]} />
        </mesh>
        <mesh position={[-0.188, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
          <cylinderGeometry args={[0.09, 0.09, 0.015, 32]} />
        </mesh>
        <mesh position={[-0.11, 0.43, 0.21]} material={materials.chrome}>
          <sphereGeometry args={[0.046, 20, 20]} />
        </mesh>
        <mesh position={[-0.11, -0.42, 0.18]} material={materials.accent}>
          <cylinderGeometry args={[0.032, 0.032, 0.04, 20]} />
        </mesh>
        <mesh position={[0.185, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.cushion}>
          <torusGeometry args={[0.43, 0.17, 32, 60]} />
        </mesh>
        <mesh position={[0.165, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.acousticMesh}>
          <cylinderGeometry args={[0.34, 0.34, 0.02, 48]} />
        </mesh>
      </group>

      {/* ─── RIGHT EAR CUP ASSEMBLY (HERO EXPLODED TARGET) ─── */}
      <group position={[1.29, -0.14, 0]}>
        {/* Sub-Assembly A: Outer Acoustic Dome & Bevel */}
        <group ref={rightOuterDomeRef}>
          {/* Floating Callout: Outer Dome */}
          <Html
            position={[0.3, 0.72, 0]}
            center
            distanceFactor={5.5}
            zIndexRange={[100, 0]}
          >
            <CalloutBadge
              number="02"
              title="CNC DOME"
              opacity={labelOpacity}
              color={activeColorway.hex}
            />
          </Html>

          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.chassis}>
            <cylinderGeometry args={[0.59, 0.57, 0.28, 64]} />
          </mesh>
          <mesh position={[0.145, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.accent}>
            <cylinderGeometry args={[0.54, 0.49, 0.04, 64]} />
          </mesh>

          {/* Ambient spatial microphone */}
          <mesh position={[0.11, 0.43, 0.21]} material={materials.chrome}>
            <sphereGeometry args={[0.046, 20, 20]} />
          </mesh>
          {/* Bass port valve */}
          <mesh position={[0.11, -0.42, 0.18]} material={materials.accent}>
            <cylinderGeometry args={[0.032, 0.032, 0.04, 20]} />
          </mesh>
        </group>

        {/* Sub-Assembly B: LED Halo Ring & Central Medallion */}
        <group ref={rightLedHaloRef}>
          <mesh rotation={[0, Math.PI / 2, 0]} material={materials.led}>
            <torusGeometry args={[0.39, 0.024, 24, 80]} />
          </mesh>
          <mesh position={[0.01, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.chassis}>
            <cylinderGeometry args={[0.24, 0.24, 0.025, 48]} />
          </mesh>
          <mesh position={[0.022, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
            <cylinderGeometry args={[0.09, 0.09, 0.015, 32]} />
          </mesh>
        </group>

        {/* Sub-Assembly C: 40mm Beryllium Transducer Core (Internal Audiophile Engine) */}
        <group ref={rightDriverCoreRef}>
          {/* Floating Callout: Transducer Core */}
          <Html
            position={[0, -0.76, 0]}
            center
            distanceFactor={5.5}
            zIndexRange={[100, 0]}
          >
            <CalloutBadge
              number="03"
              title="40MM BERYLLIUM"
              opacity={labelOpacity}
              color={activeColorway.hex}
            />
          </Html>

          {/* Neodymium Magnet Assembly */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.magnet}>
            <cylinderGeometry args={[0.36, 0.36, 0.06, 48]} />
          </mesh>
          {/* Copper Voice Coil Ring */}
          <mesh position={[0.035, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.voiceCoil}>
            <torusGeometry args={[0.22, 0.02, 16, 48]} />
          </mesh>
          {/* Beryllium Diaphragm Dome */}
          <mesh position={[0.042, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.driverGold}>
            <sphereGeometry args={[0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
          </mesh>
          {/* Acoustic Driver Suspension Ring */}
          <mesh position={[0.038, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.accent}>
            <torusGeometry args={[0.32, 0.022, 16, 48]} />
          </mesh>
          {/* Acoustic Diaphragm Grill */}
          <mesh position={[-0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.acousticMesh}>
            <cylinderGeometry args={[0.35, 0.35, 0.015, 48]} />
          </mesh>
        </group>

        {/* Sub-Assembly D: Front Baffle & Memory-Foam Cushion */}
        <group ref={rightCushionRef}>
          {/* Floating Callout: Cushion Seal */}
          <Html
            position={[-0.2, 0.68, 0]}
            center
            distanceFactor={5.5}
            zIndexRange={[100, 0]}
          >
            <CalloutBadge
              number="04"
              title="ACOUSTIC SEAL"
              opacity={labelOpacity}
              color={activeColorway.hex}
            />
          </Html>

          {/* Front Baffle Ring */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.accent}>
            <cylinderGeometry args={[0.52, 0.52, 0.025, 48]} />
          </mesh>
          {/* Memory Foam Cushion Ring */}
          <mesh rotation={[0, Math.PI / 2, 0]} material={materials.cushion}>
            <torusGeometry args={[0.43, 0.17, 32, 60]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
