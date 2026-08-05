// src/utils/weightedRandom.test.ts
import { weightedRandom } from './weightedRandom';

describe('weightedRandom', () => {
  it('should return index based on weight distribution', () => {
    const weights = [1, 2, 3];
    expect(weightedRandom(weights)).toBe(0);
    expect(weightedRandom(weights)).toBe(1);
    expect(weightedRandom(weights)).toBe(2);
  });

  it('should handle weights that sum to 1', () => {
    const weights = [0.2, 0.3, 0.5];
    expect(weightedRandom(weights)).toBe(0);
    expect(weightedRandom(weights)).toBe(1);
    expect(weightedRandom(weights)).toBe(2);
  });

  it('should return 0 for single weight', () => {
    const weights = [100];
    expect(weightedRandom(weights)).toBe(0);
  });

  it('should handle weights that sum to more than 1', () => {
    const weights = [2, 2, 2];
    expect(weightedRandom(weights)).toBe(0);
    expect(weightedRandom(weights)).toBe(1);
    expect(weightedRandom(weights)).toBe(2);
  });

  // Add more test cases as needed
});