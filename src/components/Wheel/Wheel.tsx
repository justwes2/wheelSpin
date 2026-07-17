import type { RenderedSlice } from '../../types/slice'
import {
  describeArcPath,
  polarToCartesian,
  getLabelFontSize,
  getRadialLabelRotation,
  OUTSIDE_LABEL_ANGLE_THRESHOLD,
  MIN_LABEL_FONT_SIZE,
} from '../../utils/wheelMath'
import styles from './Wheel.module.css'


interface WheelProps {
  slices: RenderedSlice[]
  rotation: number
  spinning: boolean
  onTransitionEnd?: () => void
}

const SIZE = 320
const CENTER = SIZE / 2
const RADIUS = CENTER - 8
const LABEL_RADIUS = RADIUS * 0.62
const OUTSIDE_LABEL_RADIUS = RADIUS + 24

export function Wheel({ slices, rotation, spinning, onTransitionEnd }: WheelProps) {
  return (
    <div className={styles.wheelWrapper}>
      <div className={styles.pointer} aria-hidden="true" />
      <svg
        className={styles.wheel}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Spin wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          className={styles.wheelBackground}
        />
        {slices.map((slice) => {
          const path = describeArcPath(
            CENTER,
            CENTER,
            RADIUS,
            slice.startAngle,
            slice.endAngle,
          )
          const isOutside = slice.angle < OUTSIDE_LABEL_ANGLE_THRESHOLD
          const fontSize = isOutside
            ? MIN_LABEL_FONT_SIZE
            : getLabelFontSize(slice.angle)
          const labelPos = polarToCartesian(
            CENTER,
            CENTER,
            isOutside ? OUTSIDE_LABEL_RADIUS : LABEL_RADIUS,
            slice.midAngle,
          )
          const edgePos = isOutside
            ? polarToCartesian(CENTER, CENTER, RADIUS, slice.midAngle)
            : null

          return (
            <g key={slice.index}>
              <path
                d={path}
                fill={slice.color}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              {isOutside && edgePos && (
                <line
                  x1={edgePos.x}
                  y1={edgePos.y}
                  x2={labelPos.x}
                  y2={labelPos.y}
                  className={styles.leaderLine}
                  strokeWidth={1}
                />
              )}
              <text
                x={labelPos.x}
                y={labelPos.y}
                fontSize={fontSize}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={
                  isOutside
                    ? undefined
                    : `rotate(${getRadialLabelRotation(slice.midAngle)}, ${labelPos.x}, ${labelPos.y})`
                }
                fill={isOutside ? undefined : '#ffffff'}

                className={
                  isOutside
                    ? `${styles.sliceLabel} ${styles.outsideLabel}`
                    : styles.sliceLabel
                }
              >
                {slice.label}
              </text>

            </g>
          )
        })}
        <circle cx={CENTER} cy={CENTER} r={10} className={styles.hub} />
      </svg>
    </div>
  )
}
