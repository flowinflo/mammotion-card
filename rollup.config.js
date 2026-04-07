import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/mammotion-card.js",
  output: {
    file: "dist/mammotion-card.js",
    format: "es",
  },
  plugins: [resolve(), terser()],
};
