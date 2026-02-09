/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                dark: {
                    900: '#0a0a0a', // Deep black
                    800: '#1a1a1a', // Soft black
                    700: '#2a2a2a', // Charcoal
                    card: '#141414',
                },
                light: {
                    100: '#ffffff', // Pure white
                    200: '#fafafa', // Off white
                    300: '#f5f5f5', // Light gray
                },
                primary: {
                    DEFAULT: '#9b1c1c', // Maroon
                    hover: '#7f1d1d', // Darker Maroon
                    light: 'rgba(155, 28, 28, 0.08)',
                },
                accent: {
                    DEFAULT: '#7f1d1d', // Dark Maroon
                    hover: '#9b1c1c', // Maroon
                },
                neutral: {
                    DEFAULT: '#737373', // Medium gray
                    light: '#a3a3a3', // Light gray
                    dark: '#404040', // Dark gray
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
