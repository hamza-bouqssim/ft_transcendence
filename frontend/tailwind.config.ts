import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
				Whitney: ["Whitney", "sans-serif"],
				"Whitney BlackSC": ["Whitney BlackSC", "sans-serif"],
				"Whitney Semibold": ["Whitney Semibold", "sans-serif"],
				"Whitney Bold": ["Whitney Bold", "sans-serif"],
			},
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
