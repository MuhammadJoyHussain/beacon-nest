/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        foundation: {
          primary: '#3D52A0',
          blue: '#7091E6',
          softblue: '#8697C4',
          pale: '#ADBBDA',
          background: '#EDE8F5',
        },
      },
    },
  },
  plugins: [],
}
