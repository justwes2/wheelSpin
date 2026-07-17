/**
 * A single wheel slice as defined in the source data file (src/data/slices.json).
 */
export interface Slice {
  /** Display label shown on the wheel and in the legend/result modal. */
  label: string
  /**
   * Relative weight of this slice. Does not need to sum to 100 across all
   * slices - probability is computed as weight / sum(all weights).
   */
  weight: number
}

/** Shape of the slices.json data file. */
export interface SlicesData {
  slices: Slice[]
}

/**
 * A slice enriched with derived, render-ready information:
 * its assigned color, exact probability, and its angular position on the wheel.
 */
export interface RenderedSlice extends Slice {
  /** Index of this slice in the original data array (stable identity). */
  index: number
  /** Assigned color (from the fixed palette), consistent by index. */
  color: string
  /** Probability as a fraction (0-1), i.e. weight / totalWeight. */
  probability: number
  /** Start angle of this slice's arc, in degrees, measured clockwise from 12 o'clock (0deg). */
  startAngle: number
  /** End angle of this slice's arc, in degrees, measured clockwise from 12 o'clock (0deg). */
  endAngle: number
  /** Angular width of this slice, in degrees (endAngle - startAngle). */
  angle: number
  /** Midpoint angle of this slice, in degrees - used for label placement and result targeting. */
  midAngle: number
}
