// Tailwind CSS Configuration for Asiatensor
tailwind.config = {
  darkMode: 'class',
  content: [
    "./*.html",
    "./assets/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Takao', 'IPAexGothic', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP', 'sans-serif'],
        'serif': ['Source Serif Pro', 'Georgia', 'Hiragino Mincho Pro', 'Yu Mincho', 'YuMincho', 'IPAexMincho', 'IPAPMincho', 'VL PMincho', 'Noto Serif CJK JP', 'serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Osaka-Mono', 'MS Gothic', 'monospace'],
      },
      colors: {
        // Custom color palette for Asiatensor brand
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Enhanced gray scale for better contrast
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-neural': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-tech': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)' 
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)' 
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)' 
          },
          '50%': { 
            transform: 'translateY(-10px)' 
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      letterSpacing: {
        'wider': '0.05em',
        'widest': '0.1em',
        'ultra-wide': '0.25em',
      },
      lineHeight: {
        'extra-loose': '2.5',
        '12': '3rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [
    // Custom plugin for prose styling
    function({ addComponents, theme }) {
      addComponents({
        '.prose-asiatensor': {
          maxWidth: 'none',
          color: theme('colors.gray.700'),
          lineHeight: theme('lineHeight.7'),
          '> * + *': {
            marginTop: theme('spacing.6'),
          },
          'h1, h2, h3, h4': {
            color: theme('colors.gray.900'),
            fontFamily: theme('fontFamily.serif').join(', '),
            fontWeight: theme('fontWeight.bold'),
            lineHeight: theme('lineHeight.tight'),
          },
          'h1': {
            fontSize: theme('fontSize.4xl')[0],
            marginBottom: theme('spacing.6'),
          },
          'h2': {
            fontSize: theme('fontSize.3xl')[0],
            marginBottom: theme('spacing.4'),
          },
          'h3': {
            fontSize: theme('fontSize.2xl')[0],
            marginBottom: theme('spacing.3'),
          },
          'p': {
            fontSize: theme('fontSize.lg')[0],
          },
          'code': {
            fontFamily: theme('fontFamily.mono').join(', '),
            fontSize: theme('fontSize.sm')[0],
            backgroundColor: theme('colors.gray.100'),
            padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
            borderRadius: theme('borderRadius.md'),
          },
          // Dark mode styles
          '@media (prefers-color-scheme: dark)': {
            '&.dark': {
              color: theme('colors.gray.300'),
              'h1, h2, h3, h4': {
                color: theme('colors.white'),
              },
              'code': {
                backgroundColor: theme('colors.gray.800'),
              },
            }
          }
        }
      })
    }
  ]
}