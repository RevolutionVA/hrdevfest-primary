/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'brand-teal': '#2B5F6D',
				'brand-teal-dark': '#1E4A55',
				'brand-red': '#E53935',
				'brand-red-dark': '#C62828',
				'brand-blue': '#267BD9',
				'brand-yellow': '#F4B00F',
				'brand-green': '#27B738',
			},
		},
	},
	plugins: [],
}
