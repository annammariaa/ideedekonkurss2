/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#F5FAFC',
        text: '#1F2A37',
        secondaryText: '#6B7280',
        accent: '#4F46E5',
        inputBorder: '#CBD5E1',
        inputHover: '#94A3B8',
        inputFocus: '#4F46E5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto'],
      },
      maxWidth: {
        container: '1200px',
      },
      padding: {
        container: '32px',
      },
      gap: {
        grid: '48px',
      },
      borderRadius: {
        default: '12px',
      },
      boxShadow: {
        default: '0 6px 18px rgba(31, 42, 55, 0.06)',
      },
    },
  },
  plugins: [],
}
