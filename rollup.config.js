import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import typescript from "@wessberg/rollup-plugin-ts";
import postcss from 'rollup-plugin-postcss';

const svelteOptions = require("./svelte.config");

const production = !process.env.ROLLUP_WATCH;

export default {
	input: "src/main.ts",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/bundle.js"
	},
	plugins: [
		postcss({ extract: true }),
		json(),
		svelte({
			...svelteOptions,
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write("public/bundle.css");
			}
		}),

		resolve({
			browser: true,
			dedupe: importee =>
				importee === "svelte" || importee.startsWith("svelte/")
		}),
		commonjs(),
		typescript(),

		!production && livereload("public"),

		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
