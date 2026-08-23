/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { void: '#050914', panel: '#081426', sao: { blue: '#2F80ED', cyan: '#56CCF2', sky: '#38BDF8', violet: '#8B5CF6' } }, fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] }, boxShadow: { holo: '0 0 40px rgba(56, 189, 248, 0.13)' } } },
  plugins: [],
}
