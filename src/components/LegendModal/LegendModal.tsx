import { Modal } from '../Modal/Modal'
import type { RenderedSlice } from '../../types/slice'
import styles from './LegendModal.module.css'

interface LegendModalProps {
  isOpen: boolean
  onClose: () => void
  slices: RenderedSlice[]
}

export function LegendModal({ isOpen, onClose, slices }: LegendModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Probabilities">
      <ul className={styles.list}>
        {slices.map((slice) => (
          <li key={slice.index} className={styles.item}>
            <span
              className={styles.swatch}
              style={{ backgroundColor: slice.color }}
              aria-hidden="true"
            />
            <span className={styles.label}>{slice.label}</span>
            <span className={styles.percentage}>
              {(slice.probability * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
