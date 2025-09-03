/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(220, 80%, 95%)',
          100: 'hsl(220, 80%, 90%)',
          200: 'hsl(220, 80%, 80%)',
          300: 'hsl(220, 80%, 70%)',
          400: 'hsl(220, 80%, 60%)',
          500: 'hsl(220, 80%, 50%)',
          600: 'hsl(220, 80%, 40%)',
          700: 'hsl(220, 80%, 30%)',
          800: 'hsl(220, 80%, 20%)',
          900: 'hsl(220, 80%, 10%)',
        },
        accent: {
          50: 'hsl(160, 70%, 95%)',
          100: 'hsl(160, 70%, 90%)',
          200: 'hsl(160, 70%, 80%)',
          300: 'hsl(160, 70%, 70%)',
          400: 'hsl(160, 70%, 60%)',
          500: 'hsl(160, 70%, 45%)',
          600: 'hsl(160, 70%, 35%)',
          700: 'hsl(160, 70%, 25%)',
          800: 'hsl(160, 70%, 15%)',
          900: 'hsl(160, 70%, 10%)',
        },
        background: 'hsl(225, 10%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      borderRadius: {
        sm: '4px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0,0%,0%,0.08)',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'hsl(220, 80%, 50%)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            code: {
              color: 'hsl(220, 80%, 50%)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

