import { Modal } from '../Modal/Modal'
import type { RenderedSlice } from '../../types/slice'
import styles from './ResultModal.module.css'

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  winner: RenderedSlice | null
}

export function ResultModal({ isOpen, onClose, winner }: ResultModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Result">
      {winner && (
        <div className={styles.result}>
          <span
            className={styles.swatch}
            style={{ backgroundColor: winner.color }}
            aria-hidden="true"
          />
          <p className={styles.winnerLabel}>You got: {winner.label}!</p>
          <button type="button" className={styles.okButton} onClick={onClose}>
            Nice!
          </button>
        </div>
      )}
    </Modal>
  )
}
