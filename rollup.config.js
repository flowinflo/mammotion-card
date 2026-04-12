import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

// Lit is bundled because HA does not expose lit as a resolvable ES module for custom cards.
// Tested external: ["lit"] — browser throws "Failed to resolve module specifier 'lit'".
export default {
  input: "src/mammotion-card.js",
  output: {
    file: "dist/mammotion-card.js",
    format: "es",
  },
  plugins: [resolve(), terser()],
};
