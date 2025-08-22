import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'climbing-green': '#22c55e',
        'climbing-yellow': '#eab308',
        'climbing-red': '#ef4444',
        'climbing-purple': '#a855f7',
        'climbing-black': '#1f2937',
      },
    },
  },
  plugins: [],
}
export default config
