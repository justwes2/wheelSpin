import { useMemo, useState } from 'react'
import slicesData from './data/slices.json'
import type { RenderedSlice, SlicesData } from './types/slice'
import { buildRenderedSlices, computeSpinRotation } from './utils/wheelMath'
import { pickWeightedIndex } from './utils/weightedRandom'
import { Wheel } from './components/Wheel/Wheel'
import { SpinButton } from './components/SpinButton/SpinButton'
import { ResultModal } from './components/ResultModal/ResultModal'
import { LegendModal } from './components/LegendModal/LegendModal'
import styles from './App.module.css'

const EXTRA_SPINS = 5

function App() {
  const { slices: rawSlices } = slicesData as SlicesData
  const slices = useMemo(() => buildRenderedSlices(rawSlices), [rawSlices])

  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<RenderedSlice | null>(null)
  const [resultOpen, setResultOpen] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)

  function handleSpin() {
    if (spinning) return

    const winningIndex = pickWeightedIndex(rawSlices)
    const winningSlice = slices[winningIndex]
    const nextRotation = computeSpinRotation(
      winningSlice.midAngle,
      EXTRA_SPINS,
      rotation,
    )

    setWinner(winningSlice)
    setSpinning(true)
    setRotation(nextRotation)
  }

  function handleSpinEnd() {
    setSpinning(false)
    setResultOpen(true)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>wheelSpin</h1>
        <button
          type="button"
          className={styles.legendButton}
          onClick={() => setLegendOpen(true)}
          aria-label="Show probabilities"
        >
          Probabilities
        </button>
      </header>

      <main className={styles.main}>
        <Wheel
          slices={slices}
          rotation={rotation}
          spinning={spinning}
          onTransitionEnd={handleSpinEnd}
        />
        <SpinButton onClick={handleSpin} disabled={spinning} />
      </main>

      <ResultModal
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
        winner={winner}
      />
      <LegendModal
        isOpen={legendOpen}
        onClose={() => setLegendOpen(false)}
        slices={slices}
      />
    </div>
  )
}

export default App
