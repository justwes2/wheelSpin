/**
 * A fixed, curated palette of aesthetically pleasing, mutually distinct
 * colors. Slices are assigned colors by index, so a given slice's color
 * stays consistent across renders as long as its position in the data file
 * doesn't change.
 *
 * Sized to comfortably support at least 15-20 slices without repeats. If
 * more slices than this are provided, additional colors are generated
 * programmatically (see getColorForIndex) rather than repeating existing
 * ones, so the wheel still looks reasonable at larger sizes.
 */
export const COLOR_PALETTE: string[] = [
  '#F94144', // red
  '#F3722C', // orange
  '#F8961E', // amber
  '#F9C74F', // yellow
  '#C9CF3B', // yellow-green
  '#90BE6D', // green
  '#43AA8B', // teal green
  '#4D908E', // slate teal
  '#5AA9A3', // aqua
  '#577590', // blue-gray
  '#277DA1', // blue
  '#4361EE', // indigo
  '#7048E8', // violet
  '#9D4EDD', // purple
  '#C77DFF', // lavender
  '#E56399', // pink
  '#D81159', // magenta
  '#B5838D', // dusty rose
  '#6D6875', // muted plum
  '#8D99AE', // cool gray
]

/**
 * Generates an additional, deterministic color for indices beyond the fixed
 * palette, spacing hues evenly using the golden angle so consecutive
 * generated colors remain visually distinct.
 */
function getGeneratedColor(overflowIndex: number): string {
  const goldenAngle = 137.508
  const hue = (overflowIndex * goldenAngle) % 360
  return `hsl(${hue.toFixed(1)}, 65%, 55%)`
}

/**
 * Returns the color for a slice at the given index. Uses the curated
 * palette first, then falls back to generated colors for any index beyond
 * the palette's length (supports arbitrarily many slices without repeats).
 */
export function getColorForIndex(index: number): string {
  if (index < COLOR_PALETTE.length) {
    return COLOR_PALETTE[index]
  }
  return getGeneratedColor(index - COLOR_PALETTE.length)
}
