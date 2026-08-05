// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['json', 'text'],
  setupFiles: ['src/setupTests.ts'] 
};
