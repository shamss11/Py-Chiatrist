/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sage': '#A8B8A0',
                'calm-blue': '#E0E7FF',
                'deep-teal': '#1E3A3A',
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
