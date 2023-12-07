/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { colors:{
      customBackground:'#1C2626',
      customBackground2: '#212E2E',
      customBackground3: '#552D96',
      borderColour: '#445858'
    },},
  },
  plugins: [],
}

