import '@testing-library/jest-dom';

// Extend global with vi mock type
declare global {
  interface Global {
    fetch: any;
  }
}