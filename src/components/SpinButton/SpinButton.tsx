import styles from './SpinButton.module.css'

interface SpinButtonProps {
  onClick: () => void
  disabled: boolean
}

export function SpinButton({ onClick, disabled }: SpinButtonProps) {
  return (
    <button
      type="button"
      className={styles.spinButton}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Spinning...' : 'Spin the wheel'}
    </button>
  )
}
