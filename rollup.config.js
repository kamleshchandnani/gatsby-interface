import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import resolve from "rollup-plugin-node-resolve"
import svg from "rollup-plugin-svg"

import pkg from "./package.json"

export default {
  input: `src/index.js`,
  output: [
    {
      file: pkg.main,
      format: `cjs`,
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: `es`,
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    svg({
      base64: true,
    }),
    babel({
      exclude: `node_modules/**`,
      plugins: [`@babel/external-helpers`],
    }),
    resolve(),
    commonjs(),
  ],
}
