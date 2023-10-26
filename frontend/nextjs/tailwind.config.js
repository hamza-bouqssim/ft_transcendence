/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 1s linear',
        // shake: 'shake 1s linear'
      },
      keyframes: {
        wiggle: {
          '0%, 7%': { transform: 'rotateZ(0)' },
          '15%': { transform: 'rotateZ(-15deg)' },
          '20%': { transform: 'rotateZ(10deg)' },
          '25%': { transform: 'rotateZ(-10deg)' },
          '30%': { transform: 'rotateZ(6deg)' },
          '35%': { transform: 'rotateZ(-4deg)' },
          '40%, 100%': { transform: 'rotateZ(0)' },
        },
        // shake: {
        //   '0%': { transform: 'translateX(0)' },
        //   '25%': { transform: 'translateX(5px)' },
        //   '50%': { transform: 'translateX(-5px)' },
        //   '75%': { transform: 'translateX(5px)' },
        //   '100%': { transform: 'translateX(0)' },
        // },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'Whitney': ['Whitney', 'sans-serif'],
        'Whitney BlackSC': ['Whitney BlackSC', 'sans-serif'],
        'Whitney Semibold': ['Whitney Semibold', 'sans-serif'],
        'Whitney Bold': ['Whitney Bold', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
