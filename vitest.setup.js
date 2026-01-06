import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Membersihkan jsdom setelah setiap tes berjalan
afterEach(() => {
  cleanup();
});
