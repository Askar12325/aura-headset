import { useState } from 'react'
import { type ColorwayConfig } from '../canvas/HeadsetMesh'

interface TechSpecsProps {
  activeColorway: ColorwayConfig
}

interface SpecItem {
  label: string
  value: string
  note?: string
}

interface SpecCategory {
  id: string
  number: string
  category: string
  shortLabel: string
  items: SpecItem[]
}

const SPEC_CATEGORIES: SpecCategory[] = [
  {
    id: 'audio',
    number: '01',
    category: 'ACOUSTIC TRANSDUCER',
    shortLabel: 'TRANSDUCER',
    items: [
      { label: 'Driver Architecture', value: '40mm Beryllium-Coated Mylar Dome', note: 'Dual-cavity acoustic chamber' },
      { label: 'Frequency Response', value: '4 Hz – 48,000 Hz', note: 'Hi-Res Audio Certified' },
      { label: 'Total Harmonic Distortion', value: '< 0.018% THD', note: '@ 1 kHz, 100 dB SPL' },
      { label: 'Nominal Impedance', value: '32 Ω Balanced', note: 'Ultra-low output impedance' },
      { label: 'Sensitivity', value: '108 dB SPL / 1 mW', note: 'High acoustic efficiency' },
    ],
  },
  {
    id: 'anc',
    number: '02',
    category: 'ACTIVE NOISE CANCELLATION',
    shortLabel: 'NOISE CANCEL',
    items: [
      { label: 'Active Attenuation', value: '-46 dB Dual-Stage Hybrid', note: 'Low & high frequency coverage' },
      { label: 'Microphone Array', value: 'Quad-Mic Beamforming Matrix', note: '2 Feedforward + 2 Feedback' },
      { label: 'DSP Processing Rate', value: '48 kHz / 32-bit Float', note: 'Sub-millisecond anti-wave calc' },
      { label: 'Transparency Latency', value: '< 2.1 ms Binaural Passthrough', note: 'Phase-aligned ambient audio' },
    ],
  },
  {
    id: 'connectivity',
    number: '03',
    category: 'CONNECTIVITY & PROTOCOL',
    shortLabel: 'CONNECTIVITY',
    items: [
      { label: 'AuraLink Wireless RF', value: '< 5.2 ms Latency (2.4 GHz)', note: 'Proprietary uncompressed protocol' },
      { label: 'Bluetooth Protocol', value: 'Bluetooth 5.4 LE Audio', note: 'Supported: LC3+, LDAC, AAC, SBC' },
      { label: 'Lossless Wired Mode', value: 'USB-C Async 32-bit / 384 kHz', note: 'Direct DAC bypass mode' },
      { label: 'Spatial Tracking Sensor', value: 'Integrated 6-DoF IMU', note: '1,000 Hz kinematic sampling' },
    ],
  },
  {
    id: 'physical',
    number: '04',
    category: 'PHYSICAL & POWER',
    shortLabel: 'CHASSIS & POWER',
    items: [
      { label: 'Chassis Material', value: 'Grade-5 Titanium & CNC Aluminum', note: 'PVD vapor-treated surface' },
      { label: 'Ear Cushion Seal', value: 'Viscoelastic Protein Memory Foam', note: 'Magnetic modular detachment' },
      { label: 'Mass / Total Weight', value: '248 grams (8.75 oz)', note: 'Optimized cranial balance' },
      { label: 'Battery Runtime', value: '38 Hours (ANC) // 52 Hours (Passive)', note: 'Continuous audio playback' },
      { label: 'Rapid Power Delivery', value: '15 min Charge = 8 Hours Playback', note: 'USB-C Fast Charge support' },
    ],
  },
]

export const TechSpecs = ({ activeColorway }: TechSpecsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredCategories =
    activeCategory === 'all'
      ? SPEC_CATEGORIES
      : SPEC_CATEGORIES.filter((c) => c.id === activeCategory)

  return (
    <section className="relative z-20 w-full px-4 sm:px-8 md:px-12 lg:px-20 py-20 md:py-28 bg-[#050608] border-t border-white/[0.06]">
      {/* Background subtle radial glow */}
      <div
        className="pointer-events-none absolute top-1/3 right-10 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] opacity-10 blur-[140px] transition-colors duration-700"
        style={{ backgroundColor: activeColorway.hex }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="flex flex-col gap-2.5 sm:gap-3 text-left">
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                style={{
                  backgroundColor: activeColorway.hex,
                  color: activeColorway.hex,
                }}
              />
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase">
                [ 04 // TECHNICAL SPECIFICATIONS ]
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
              PRECISION ENGINEERING.
            </h2>

            <p className="text-xs sm:text-sm font-mono text-neutral-400 max-w-lg leading-relaxed">
              Laboratory-calibrated acoustic performance and physical tolerances verified to reference audiophile standards.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-1 rounded-2xl sm:rounded-full border border-white/[0.08] bg-black/60 backdrop-blur-xl self-start md:self-auto shadow-xl">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 sm:px-3.5 py-2 sm:py-1.5 min-h-[38px] sm:min-h-0 text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest rounded-xl sm:rounded-full transition-all duration-300 flex items-center justify-center ${
                activeCategory === 'all'
                  ? 'text-white bg-white/[0.14] font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              ALL SPECS
            </button>
            {SPEC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 sm:px-3.5 py-2 sm:py-1.5 min-h-[38px] sm:min-h-0 text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest rounded-xl sm:rounded-full transition-all duration-300 flex items-center justify-center ${
                  activeCategory === cat.id
                    ? 'text-white bg-white/[0.14] font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Spec Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-2xl shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500">
                      {cat.number} //
                    </span>
                    <h3 className="text-xs md:text-sm font-mono tracking-widest text-white uppercase font-bold">
                      {cat.category}
                    </h3>
                  </div>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: activeColorway.hex }}
                  />
                </div>

                {/* Items List */}
                <div className="space-y-3.5 sm:space-y-4">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-white/[0.04] last:border-b-0"
                    >
                      <span className="text-[11px] font-mono text-neutral-400">
                        {item.label}
                      </span>
                      <div className="flex flex-col sm:items-end">
                        <span className="text-xs md:text-sm font-mono text-white font-medium">
                          {item.value}
                        </span>
                        {item.note && (
                          <span className="text-[9px] font-mono text-neutral-500 tracking-wider">
                            {item.note}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
