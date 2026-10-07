export interface HotspotConfig {
  id: string
  number: string
  shortName: string
  title: string
  tag: string
  spec: string
  detail: string
  position: [number, number, number]
  cameraPos: [number, number, number]
  cameraLookAt: [number, number, number]
}

export const HOTSPOTS: HotspotConfig[] = [
  {
    id: 'driver',
    number: '01',
    shortName: '40mm Driver',
    title: 'Beryllium Transducer Core',
    tag: 'ACOUSTIC ENGINE',
    spec: '40mm Dual-Dome // Beryllium-Coated',
    detail: 'Ultra-rigid vapour-deposited beryllium diaphragm driven by high-flux neodymium motors, delivering sub-0.018% total harmonic distortion.',
    position: [1.32, -0.15, 0.38],
    cameraPos: [1.75, -0.05, 1.8],
    cameraLookAt: [1.25, -0.15, 0],
  },
  {
    id: 'headband',
    number: '02',
    shortName: 'Titanium Arch',
    title: 'Multi-Axis Titanium Spine',
    tag: 'STRUCTURAL CHASSIS',
    spec: 'Grade-5 Titanium // Anodized Smoked PVD',
    detail: 'Lightweight memory-flex headband spine distributing contact pressure evenly across the cranial crown with calibrated 32mm sliding extenders.',
    position: [0, 1.48, 0.05],
    cameraPos: [0, 1.55, 2.2],
    cameraLookAt: [0, 1.2, 0],
  },
  {
    id: 'cushion',
    number: '03',
    shortName: 'Memory Cushion',
    title: 'Viscoelastic Acoustic Cushion',
    tag: 'PASSIVE ISOLATION',
    spec: 'Protein Leather // Viscoelastic Matrix',
    detail: 'Thermally-responsive memory foam that moulds to facial contours, creating an airtight acoustic seal achieving -46dB passive background isolation.',
    position: [1.06, -0.22, 0.38],
    cameraPos: [0.85, -0.1, 1.85],
    cameraLookAt: [1.2, -0.15, 0],
  },
  {
    id: 'halo',
    number: '04',
    shortName: 'Cyber Halo',
    title: 'Optical Halo & Telemetry Sensor',
    tag: 'TELEMETRY INTERFACE',
    spec: '360° Light-Guide // Spatial Diode',
    detail: 'Recessed micro-prism light ring communicating real-time spatial audio pipeline status, low-latency RF lock, and battery level at a glance.',
    position: [1.46, 0.16, 0.32],
    cameraPos: [2.1, 0.15, 1.9],
    cameraLookAt: [1.35, 0.05, 0],
  },
]
