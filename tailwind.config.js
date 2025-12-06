/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#d60000', // PDAM Red (Vibrant, from logo crescent)
                secondary: '#000000', // PDAM Black (Logo background)
                accent: '#94a3b8', // Slate-400 (Silver/Grey text match)
                background: '#f8fafc', // Slate-50 (Clean white/grey for contrast)
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
