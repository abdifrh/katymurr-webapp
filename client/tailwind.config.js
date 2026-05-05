/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        warm: '#E5C89C',
        accent: '#C19A6B',
        dark: '#9B8272',
        white: '#FFFFFF',
      },
      fontFamily: {
        primary: ['Cormorant Garamond', 'Georgia', 'serif'],
        secondary: ['Georgia', 'Times New Roman', 'serif'],
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
        xxl: '6rem',
      },
      transitionDuration: {
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
}

