import type { Slice } from '../types/slice'

/**
 * Given a list of slices with weights, picks one at random such that the
 * probability of picking slice i is (slice[i].weight / sum of all weights).
 *
 * Weights do not need to sum to any particular total (e.g. 100) - only their
 * relative magnitudes matter.
 *
 * @param slices - non-empty array of slices to choose from
 * @param randomFn - source of randomness in [0, 1); defaults to Math.random.
 *   Exposed as a parameter to make this function deterministic/testable.
 * @returns the index (into `slices`) of the chosen slice
 */
export function pickWeightedIndex(
  slices: Slice[],
  randomFn: () => number = Math.random,
): number {
  if (slices.length === 0) {
    throw new Error('pickWeightedIndex: slices must be a non-empty array')
  }

  const totalWeight = slices.reduce((sum, slice) => sum + slice.weight, 0)

  if (totalWeight <= 0) {
    throw new Error(
      'pickWeightedIndex: total weight of all slices must be greater than 0',
    )
  }

  const target = randomFn() * totalWeight

  let cumulative = 0
  for (let i = 0; i < slices.length; i++) {
    cumulative += slices[i].weight
    if (target < cumulative) {
      return i
    }
  }

  // Fallback for floating point edge cases (target === totalWeight exactly).
  return slices.length - 1
}

/**
 * Computes the exact probability (0-1) of each slice being chosen.
 */
export function computeProbabilities(slices: Slice[]): number[] {
  const totalWeight = slices.reduce((sum, slice) => sum + slice.weight, 0)
  if (totalWeight <= 0) {
    return slices.map(() => 0)
  }
  return slices.map((slice) => slice.weight / totalWeight)
}
