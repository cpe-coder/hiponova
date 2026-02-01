/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./global.css",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: "#ff8903",
				secondary: "#374151",
				accent: "#556270",
				orange: {
					100: "#fff4e5",
					200: "#ffd9b3",
					300: "#ffbb80",
					400: "#ff9e4d",
					500: "#ff8903",
					600: "#cc6a03",
					700: "#994c02",
					800: "#662e01",
					900: "#331701",
				},
			},
		},
	},
	plugins: [],
};
