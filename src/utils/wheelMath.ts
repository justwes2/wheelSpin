import type { RenderedSlice, Slice } from '../types/slice'
import { getColorForIndex } from './colorPalette'

/**
 * Below this angle (in degrees), a slice is considered too narrow to fit a
 * legible label inside it - the label is instead placed outside the wheel
 * with a leader line pointing back to the slice.
 */
export const OUTSIDE_LABEL_ANGLE_THRESHOLD = 18

/** Largest/smallest font sizes (px) used for in-slice labels, scaled by angle. */
export const MAX_LABEL_FONT_SIZE = 18
export const MIN_LABEL_FONT_SIZE = 10

/**
 * Converts polar coordinates (centered at cx,cy) to cartesian x/y.
 * Angle is in degrees, measured clockwise from 12 o'clock (0deg = straight up).
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  // Convert so 0deg = up (i.e. -90deg in standard math convention), clockwise.
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

/**
 * Builds an SVG path `d` attribute string for a pie slice (wedge) of a
 * circle centered at (cx, cy) with the given radius, spanning from
 * startAngle to endAngle (degrees, clockwise from 12 o'clock).
 */
export function describeArcPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  // Full-circle special case (single slice): draw as two half-arcs since a
  // single SVG arc command can't span 360 degrees.
  if (endAngle - startAngle >= 359.999) {
    const mid = startAngle + 180
    const p1 = polarToCartesian(cx, cy, radius, startAngle)
    const pMid = polarToCartesian(cx, cy, radius, mid)
    return [
      `M ${cx} ${cy}`,
      `L ${p1.x} ${p1.y}`,
      `A ${radius} ${radius} 0 1 1 ${pMid.x} ${pMid.y}`,
      `A ${radius} ${radius} 0 1 1 ${p1.x} ${p1.y}`,
      'Z',
    ].join(' ')
  }

  const start = polarToCartesian(cx, cy, radius, startAngle)
  const end = polarToCartesian(cx, cy, radius, endAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

/**
 * Takes raw slice data and derives everything needed to render the wheel:
 * per-slice color, probability, and angular position (start/end/mid angle).
 * Slices are laid out clockwise starting at 12 o'clock (0deg), in array order.
 */
export function buildRenderedSlices(slices: Slice[]): RenderedSlice[] {
  const totalWeight = slices.reduce((sum, slice) => sum + slice.weight, 0)

  let cursor = 0
  return slices.map((slice, index) => {
    const angle = totalWeight > 0 ? (slice.weight / totalWeight) * 360 : 0
    const startAngle = cursor
    const endAngle = cursor + angle
    cursor = endAngle

    return {
      ...slice,
      index,
      color: getColorForIndex(index),
      probability: totalWeight > 0 ? slice.weight / totalWeight : 0,
      startAngle,
      endAngle,
      angle,
      midAngle: startAngle + angle / 2,
    }
  })
}

/**
 * Scales a label's font size down as its slice angle narrows, clamped
 * between MIN_LABEL_FONT_SIZE and MAX_LABEL_FONT_SIZE. Intended for slices
 * wide enough to render their label inside the wheel (see
 * OUTSIDE_LABEL_ANGLE_THRESHOLD for the cutoff where labels move outside).
 */
export function getLabelFontSize(angle: number): number {
  const clampedAngle = Math.min(Math.max(angle, 0), 90)
  const t = clampedAngle / 90
  return MIN_LABEL_FONT_SIZE + t * (MAX_LABEL_FONT_SIZE - MIN_LABEL_FONT_SIZE)
}

/**
 * Given a target angle (degrees, clockwise from 12 o'clock) that the pointer
 * should land on, and the wheel's current visual rotation, computes the final
 * `rotate()` transform angle (degrees) to animate to. Adds `extraSpins` full
 * rotations for visual effect, and lands so the pointer (fixed at 0deg / 12
 * o'clock) points at the middle of the target slice.
 */
export function computeSpinRotation(
  targetMidAngle: number,
  extraSpins: number,
  currentRotation: number,
): number {
  // The wheel rotates clockwise by `rotation` degrees. For the pointer
  // (fixed at top, 0deg) to point at `targetMidAngle` on the *unrotated*
  // wheel, the wheel must be rotated by (360 - targetMidAngle) mod 360.
  const baseRotation = (360 - targetMidAngle) % 360

  // Normalize current rotation to figure out how many full turns have
  // already accumulated, so we always spin forward from where we are.
  const currentFullTurns = Math.floor(currentRotation / 360)
  const targetRotation = (currentFullTurns + extraSpins) * 360 + baseRotation

  // Ensure we always move forward by at least some amount even if the target
  // lands very close to (or behind) the current rotation.
  if (targetRotation <= currentRotation) {
    return targetRotation + 360
  }
  return targetRotation
}
