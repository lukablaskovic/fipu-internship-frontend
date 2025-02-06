/* eslint-env node */

const plugin = require("tailwind-scrollbar");

module.exports = {
	mode: "jit",
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		asideScrollbars: {
			light: "light",
			gray: "gray",
		},
		checkRadioSwitchStates: {
			info: "blue",
			success: "green",
			warning: "yellow",
			danger: "red",
		},

		corePlugins: {
			aspectRatio: false,
		},

		extend: {
			screens: {
				"3xl": "1600px",
				ultrawide: "2560px",
			},
			maxWidth: {
				"8xl": "90rem",
			},
			colors: {
				fipu_blue: "#46bae0", //"#74d4f4",
				fipu_gray: "#212529",
				fipu_light_blue: "#74d4f4", //#9de0f7",
				fipu_dark_blue: "#2b91b3", //"#6EB9ED",
				fipu_text_blue: "#31c4f5", //"#6dd0f6",
				fipu_gray2: "#172234", //"#6dd0f6",
				search_bar: "#c7c8c9",
			},
			spacing: {
				22: "5.5rem",
			},
			zIndex: {
				"-1": "-1",
				100: "100",
			},
			height: {
				"screen-menu": "calc(100vh - 3.5rem)",
			},
			maxHeight: {
				"screen-menu": "calc(100vh - 3.5rem)",
				modal: "calc(100vh - 160px)",
			},
			transitionProperty: {
				position: "right, left, top, bottom, margin, padding",
				textColor: "color",
				size: "width, height",
				backgroundImage: "background-image",
			},
			keyframes: {
				shake: {
					"from, to": { transform: "translate3d(0, 0, 0)" },
					"10%, 30%, 50%, 70%, 90%": { transform: "translate3d(-10px, 0, 0)" },
					"20%, 40%, 60%, 80%": { transform: "translate3d(10px, 0, 0)" },
				},
				"fade-in-up": {
					from: { opacity: 0, transform: "translate3d(0, 100%, 0)" },
					to: { opacity: 1, transform: "none" },
				},
				"fade-out-down": {
					from: { opacity: 1 },
					to: { opacity: 0, transform: "translate3d(0, 100%, 0)" },
				},
				"fade-out": {
					from: { opacity: 1 },
					to: { opacity: 0 },
				},
				"fade-in": {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				"fade-in-left": {
					from: {
						opacity: "0",
						transform: "translate3d(-50%, 0, 0)",
					},
					to: {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"fade-in-right": {
					from: {
						opacity: "0",
						transform: "translate3d(50%, 0, 0)",
					},
					to: {
						opacity: 1,
						transform: "translate3d(0, 0, 0)",
					},
				},
				"slide-in-left": {
					from: {
						transform: "translate3d(-30%, 0, 0)",
						visibility: "visible",
					},
					to: {
						transform: "translate3d(0, 0, 0)",
					},
				},
			},
			animation: {
				shake: "shake 500ms ease-in-out",
				"fade-in-up-fast": "fade-in-up 150ms ease-in-out",
				"fade-out-down-fast": "fade-out-down 150ms ease-in-out",
				"fade-out": "fade-out 250ms ease-in-out",
				"fade-in": "fade-in 250ms ease-in-out",
				"fade-in-fast": "fade-in 150ms ease-in-out",
				"slide-in-left-fast": "slide-in-left 150ms ease-in-out",
				"fade-in-left-fast": "fade-in-left 150ms ease-in-out",
				"fade-in-right-fast": "fade-in-right 150ms ease-in-out",
			},
		},
	},
	plugins: [
		require("tailwind-scrollbar")({ nocompatible: true }),
		require("@tailwindcss/forms"),
		require("@tailwindcss/aspect-ratio"),

		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"aside-scrollbars": (value) => {
						const track = value === "light" ? "100" : "900";
						const thumb = value === "light" ? "300" : "600";
						const color = value === "light" ? "gray" : value;

						return {
							scrollbarWidth: "thin",
							scrollbarColor: `${theme(`colors.${color}.${thumb}`)} ${theme(`colors.${color}.${track}`)}`,
							"&::-webkit-scrollbar": {
								width: "8px",
								height: "8px",
							},
							"&::-webkit-scrollbar-track": {
								fipu_blue: theme(`colors.${color}.${track}`),
							},
							"&::-webkit-scrollbar-thumb": {
								borderRadius: "0.25rem",
								fipu_blue: theme(`colors.${color}.${thumb}`),
							},
						};
					},
				},
				{ values: theme("asideScrollbars") },
			);
		}),
	],
};
