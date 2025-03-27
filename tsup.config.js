import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react", "react-dom"],
  sourcemap: true,
  clean: true,
  minify: true,
  target: "es2020",
  bundle: true,
  platform: "browser",
});
