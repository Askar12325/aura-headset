import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Sparkles, Environment, Lightformer } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { HeadsetMesh, type ColorwayConfig, type AudioMode } from './HeadsetMesh'
import { type HotspotConfig } from './hotspots'

interface SceneProps {
  activeColorway: ColorwayConfig
  audioMode?: AudioMode
  autoRotate?: boolean
  scrollProgress?: number
  activeHotspot: HotspotConfig | null
  onSelectHotspot: (hotspot: HotspotConfig | null) => void
}

// Cinematic Camera Controller reacting to scroll progress and active hotspot inspection
const CameraScrollRig = ({
  scrollProgress = 0,
  activeHotspot,
}: {
  scrollProgress: number
  activeHotspot: HotspotConfig | null
}) => {
  const { camera, size } = useThree()
  const smoothedProgress = useRef(0)
  const currentPos = useRef(new THREE.Vector3(0, 0.15, 4.3))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const wasInspecting = useRef(false)

  useFrame((state, delta) => {
    const aspect = size.width / Math.max(size.height, 1)
    const isNarrow = aspect < 1.05
    const isMobile = aspect < 0.85 || size.width < 768

    // With meshScale handling the proportional sizing on mobile, camera sits at natural perspective
    const heroX = 0
    const heroY = isMobile ? 0.10 : (isNarrow ? 0.16 : 0.15)
    const heroZ = isMobile ? 4.7 : (isNarrow ? 4.5 : 4.3)
    const heroLookY = isMobile ? 0.06 : 0

    // 1. If a hotspot is actively selected, glide smoothly into macro focus
    if (activeHotspot) {
      if (!wasInspecting.current) {
        currentPos.current.copy(camera.position)
        wasInspecting.current = true
      }

      const hPos = activeHotspot.cameraPos
      const hLook = activeHotspot.cameraLookAt

      // On mobile screens, scale the macro camera target in sync with meshScale and elevate slightly
      const macroScale = isMobile ? 0.72 : 1.0
      const yOffset = isMobile ? 0.14 : 0

      const targetPos = new THREE.Vector3(
        hPos[0] * macroScale,
        (hPos[1] + yOffset) * macroScale,
        hPos[2] * (isMobile ? 0.95 : 1.0)
      )
      const targetLookAt = new THREE.Vector3(
        hLook[0] * macroScale,
        (hLook[1] + yOffset) * macroScale,
        hLook[2] * macroScale
      )

      currentPos.current.lerp(targetPos, Math.min(delta * 4.5, 1.0))
      currentLookAt.current.lerp(targetLookAt, Math.min(delta * 4.5, 1.0))

      camera.position.copy(currentPos.current)
      camera.lookAt(currentLookAt.current)

      const controls = (state as any).controls
      if (controls && controls.target) {
        controls.target.copy(currentLookAt.current)
      }
      return
    }

    if (wasInspecting.current) {
      wasInspecting.current = false
      currentPos.current.copy(camera.position)
      const controls = (state as any).controls
      if (controls && controls.target) {
        controls.target.set(0, heroLookY, 0)
      }
    }

    // 2. Otherwise follow the scroll progress trajectory
    smoothedProgress.current = THREE.MathUtils.lerp(
      smoothedProgress.current,
      scrollProgress,
      Math.min(delta * 5.0, 1.0)
    )
    const p = smoothedProgress.current

    // On desktop, shift right (1.35) so exploded model stays on left.
    // On mobile screens, keep centered (0) and pull back to 5.5 so all 4 exploded sub-assemblies stay framed!
    const explodeX = isMobile ? 0 : (isNarrow ? 0.65 : 1.35)
    const explodeY = isMobile ? 0.14 : 0.28
    const explodeZ = isMobile ? 5.5 : (isNarrow ? 4.9 : 4.0)

    const lookExplodeX = isMobile ? 0 : (isNarrow ? 0.55 : 1.15)
    const lookExplodeY = isMobile ? 0.06 : -0.05

    const targetX = THREE.MathUtils.lerp(heroX, explodeX, p)
    const targetY = THREE.MathUtils.lerp(heroY, explodeY, p)
    const targetZ = THREE.MathUtils.lerp(heroZ, explodeZ, p)

    const lookX = THREE.MathUtils.lerp(0, lookExplodeX, p)
    const lookY = THREE.MathUtils.lerp(heroLookY, lookExplodeY, p)

    currentPos.current.set(targetX, targetY, targetZ)
    currentLookAt.current.set(lookX, lookY, 0)

    if (p > 0.02) {
      camera.position.lerp(currentPos.current, Math.min(delta * 4.5, 1.0))
      camera.lookAt(currentLookAt.current)
    } else if (p <= 0.02 && smoothedProgress.current > 0.001) {
      // Re-docking into Hero rest anchor
      camera.position.lerp(new THREE.Vector3(heroX, heroY, heroZ), Math.min(delta * 4.5, 1.0))
      camera.lookAt(0, heroLookY, 0)
    }
  })

  return null
}

// Dynamic Studio Lights Rig with real-time lerping rim light and audioMode modulation
const DynamicStudioRig = ({
  color,
  audioMode = 'spatial',
}: {
  color: string
  audioMode?: AudioMode
}) => {
  const rimLightRef = useRef<THREE.PointLight>(null)
  const spatialFillRef = useRef<THREE.PointLight>(null)
  const ambientLightRef = useRef<THREE.AmbientLight>(null)
  const keyLightRef = useRef<THREE.DirectionalLight>(null)
  const fillLightRef = useRef<THREE.DirectionalLight>(null)
  const currentRimColor = useRef(new THREE.Color(color))
  const targetRimColor = useRef(new THREE.Color(color))

  targetRimColor.current.set(color)

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(delta * 4.5, 1.0)

    if (rimLightRef.current) {
      currentRimColor.current.lerp(targetRimColor.current, lerpSpeed)
      rimLightRef.current.color.copy(currentRimColor.current)

      // Audio Mode Rim Light intensity:
      // SPATIAL: 8.5 (dramatic wide bloom across the chassis)
      // STEREO: 3.6 (clean, disciplined studio line)
      // ANC: 6.0 (razor-sharp edge cutting out of pitch void)
      const targetRimIntensity = audioMode === 'spatial' ? 8.5 : audioMode === 'anc' ? 6.0 : 3.6
      const targetRimDistance = audioMode === 'spatial' ? 22 : audioMode === 'anc' ? 8 : 14
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        targetRimIntensity,
        lerpSpeed
      )
      rimLightRef.current.distance = THREE.MathUtils.lerp(
        rimLightRef.current.distance,
        targetRimDistance,
        lerpSpeed
      )
    }

    // Secondary Spatial Back Fill: bathes the opposite side in colored halo only in SPATIAL
    if (spatialFillRef.current) {
      const targetSpatialFill = audioMode === 'spatial' ? 6.5 : 0.0
      spatialFillRef.current.color.copy(currentRimColor.current)
      spatialFillRef.current.intensity = THREE.MathUtils.lerp(
        spatialFillRef.current.intensity,
        targetSpatialFill,
        lerpSpeed
      )
    }

    if (ambientLightRef.current) {
      // Audio Mode Ambient Light:
      // SPATIAL: 0.52 (bright, airy, open room)
      // STEREO: 0.26 (neutral reference)
      // ANC: 0.02 (pitch blackness, total room silence)
      const targetAmbient = audioMode === 'spatial' ? 0.52 : audioMode === 'anc' ? 0.02 : 0.26
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbient,
        lerpSpeed
      )
    }

    if (keyLightRef.current) {
      // Key light: SPATIAL 1.7, STEREO 1.3, ANC 0.55
      const targetKey = audioMode === 'spatial' ? 1.7 : audioMode === 'anc' ? 0.55 : 1.3
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        keyLightRef.current.intensity,
        targetKey,
        lerpSpeed
      )
    }

    if (fillLightRef.current) {
      // Fill light: SPATIAL 0.70, STEREO 0.38, ANC 0.0 (pure shadow in ANC)
      const targetFill = audioMode === 'spatial' ? 0.70 : audioMode === 'anc' ? 0.0 : 0.38
      fillLightRef.current.intensity = THREE.MathUtils.lerp(
        fillLightRef.current.intensity,
        targetFill,
        lerpSpeed
      )
    }
  })

  return (
    <>
      {/* Procedural Lightformers for soft specular highlights on matte black */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <Lightformer
            form="rect"
            intensity={audioMode === 'anc' ? 0.15 : audioMode === 'spatial' ? 2.2 : 1.2}
            position={[0, 6, -1]}
            scale={[12, 4, 1]}
            color="#94a3b8"
          />
          <Lightformer
            form="rect"
            intensity={audioMode === 'anc' ? 0.12 : audioMode === 'spatial' ? 1.8 : 1.0}
            position={[-7, 2, 2]}
            scale={[3, 10, 1]}
            color="#64748b"
          />
          <Lightformer
            form="rect"
            intensity={audioMode === 'anc' ? 0.08 : audioMode === 'spatial' ? 1.4 : 0.7}
            position={[7, 1, 2]}
            scale={[3, 8, 1]}
            color="#475569"
          />
        </group>
      </Environment>

      <ambientLight ref={ambientLightRef} intensity={0.28} color="#334155" />

      {/* Primary Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[4.5, 6.0, 4.0]}
        intensity={1.3}
        color="#e2e8f0"
      />

      {/* Soft Fill Light */}
      <directionalLight
        ref={fillLightRef}
        position={[-3.5, -2.0, 3.0]}
        intensity={0.45}
        color="#1e293b"
      />

      {/* Top Rim Highlight */}
      <pointLight
        position={[0, 4.0, -2.5]}
        intensity={audioMode === 'anc' ? 0.4 : audioMode === 'spatial' ? 1.8 : 1.1}
        color="#94a3b8"
      />

      {/* Dynamic Cyber Rim Light */}
      <pointLight
        ref={rimLightRef}
        position={[-4.8, 2.4, -3.0]}
        intensity={4.8}
        distance={14}
        color={color}
      />

      {/* Secondary Spatial Halo Back-Fill Light (Engaged exclusively in SPATIAL) */}
      <pointLight
        ref={spatialFillRef}
        position={[4.2, -1.5, -2.5]}
        intensity={0.0}
        distance={16}
        color={color}
      />
    </>
  )
}

export const Scene = ({
  activeColorway,
  audioMode = 'spatial',
  autoRotate = true,
  scrollProgress = 0,
  activeHotspot,
  onSelectHotspot,
}: SceneProps) => {
  // Dramatic atmospheric radial background gradient driven by active audio mode
  const bgGradient =
    audioMode === 'spatial'
      ? `radial-gradient(ellipse 110% 90% at 50% 50%, ${activeColorway.hex}44 0%, ${activeColorway.hex}16 42%, #05070c 80%, #030406 100%)`
      : audioMode === 'anc'
      ? `radial-gradient(ellipse 26% 22% at 50% 50%, ${activeColorway.hex}30 0%, rgba(0,0,0,0.96) 45%, #000000 100%)`
      : `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,255,255,0.06) 0%, ${activeColorway.hex}14 38%, rgba(6,8,12,0.85) 65%, #040507 100%)`

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768)

  return (
    <div className="fixed inset-0 w-full h-full bg-[#030406] overflow-hidden pointer-events-none">
      {/* Dynamic atmospheric radial backdrop */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none"
        style={{ background: bgGradient }}
      />

      {/* SPATIAL Mode: Animated Spherical Sound Wave Rings */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-1000 ease-out overflow-hidden"
        style={{ opacity: audioMode === 'spatial' ? 0.75 : 0 }}
      >
        <div
          className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full border border-white/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite] will-change-transform"
          style={{ borderColor: `${activeColorway.hex}35` }}
        />
        <div
          className="absolute w-[520px] sm:w-[700px] h-[520px] sm:h-[700px] rounded-full border border-white/10 animate-[ping_5.5s_cubic-bezier(0,0,0.2,1)_infinite] will-change-transform"
          style={{ borderColor: `${activeColorway.hex}22` }}
        />
        {!isTouchDevice && (
          <div
            className="absolute w-[780px] sm:w-[1050px] h-[780px] sm:h-[1050px] rounded-full border border-white/5 animate-[ping_7s_cubic-bezier(0,0,0.2,1)_infinite]"
            style={{ borderColor: `${activeColorway.hex}12` }}
          />
        )}
      </div>

      {/* STEREO Mode: Subtle Reference Studio Axis Line */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-1000 ease-out"
        style={{ opacity: audioMode === 'stereo' ? 0.5 : 0 }}
      >
        <div className="w-[700px] max-w-[85vw] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* ANC Mode: Deep Acoustic Isolation Peripheral Vignette (seals the room into total silence) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out"
        style={{
          opacity: audioMode === 'anc' ? 1 : 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 18%, rgba(0, 0, 0, 0.94) 65%, #000000 100%)',
        }}
      />

      {/* ANC Mode: Tight Circular Isolation Reticle & Inner Null Frequency Ring */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-1000 ease-out"
        style={{ opacity: audioMode === 'anc' ? 0.75 : 0 }}
      >
        <div
          className="w-[280px] sm:w-[340px] h-[280px] sm:h-[340px] rounded-full border border-dashed border-white/15 animate-[pulse_3s_ease-in-out_infinite]"
          style={{ borderColor: `${activeColorway.hex}30` }}
        />
        <div
          className="absolute w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] rounded-full border border-white/10"
          style={{ borderColor: `${activeColorway.hex}20` }}
        />
      </div>

      <Canvas
        camera={{ position: [0, 0.15, 4.3], fov: 45 }}
        gl={{
          antialias: !isTouchDevice,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={isTouchDevice ? [1, 1.25] : [1, 2]}
        className="pointer-events-auto"
        style={{ touchAction: 'pan-y' }}
      >
        <Suspense fallback={null}>
          <CameraScrollRig
            scrollProgress={scrollProgress}
            activeHotspot={activeHotspot}
          />
          <DynamicStudioRig color={activeColorway.hex} audioMode={audioMode} />

          {/* Dynamic cyber-motes: optimized particle count on mobile for smooth 60fps compositor performance */}
          {audioMode !== 'anc' && (
            <Sparkles
              key={audioMode}
              count={audioMode === 'spatial' ? (isTouchDevice ? 22 : 85) : (isTouchDevice ? 6 : 14)}
              scale={audioMode === 'spatial' ? 8.5 : 4.5}
              size={audioMode === 'spatial' ? (isTouchDevice ? 1.8 : 2.6) : 1.2}
              speed={audioMode === 'spatial' ? 0.45 : 0.12}
              opacity={audioMode === 'spatial' ? 0.65 : 0.20}
              color={activeColorway.hex}
            />
          )}

          {/* The High-End Headset Mesh with Exploded View, Audio Mode glow, and Interactive Hotspots */}
          <HeadsetMesh
            activeColorway={activeColorway}
            audioMode={audioMode}
            autoRotate={autoRotate && !activeHotspot}
            scrollProgress={scrollProgress}
            activeHotspot={activeHotspot}
            onSelectHotspot={onSelectHotspot}
          />

          {/* Ground Contact Shadow: optimized resolution and blur on mobile */}
          <ContactShadows
            position={[0, -1.82, 0]}
            opacity={isTouchDevice ? 0.65 : 0.85}
            scale={8.5}
            blur={isTouchDevice ? 1.6 : 2.6}
            far={3.8}
            resolution={isTouchDevice ? 256 : 512}
            color="#000000"
          />

          {/* OrbitControls mounted strictly on desktop mouse devices.
              On mobile/touch devices, NOT rendering OrbitControls guarantees zero pointer listeners are attached to the canvas, ensuring 100% native, unhindered page scrolling. */}
          {!isTouchDevice && (
            <OrbitControls
              makeDefault
              enabled={scrollProgress < 0.05 && activeHotspot === null}
              enableZoom={false}
              enablePan={false}
              enableDamping
              dampingFactor={0.05}
              minDistance={2.4}
              maxDistance={7.0}
              maxPolarAngle={Math.PI / 1.72}
              minPolarAngle={Math.PI / 3.4}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
