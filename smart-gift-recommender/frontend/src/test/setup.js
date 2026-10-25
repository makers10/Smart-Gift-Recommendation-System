import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock canvas-confetti for jsdom
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Polyfill window.matchMedia for jsdom
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Polyfill ResizeObserver for jsdom (required by Recharts ResponsiveContainer)
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Polyfill scrollIntoView and scrollTo for jsdom
Element.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};

// Polyfill IntersectionObserver for jsdom (required by Framer Motion whileInView / InViewFeature)
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// Safe canvas WebGL and 2D getContext fallback for jsdom
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = (type) => {
    if (type === "2d") {
      return {
        clearRect: () => {},
        fillRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {},
        arc: () => {},
        save: () => {},
        restore: () => {},
        scale: () => {},
        rotate: () => {},
        translate: () => {},
      };
    }
    return null;
  };
}
