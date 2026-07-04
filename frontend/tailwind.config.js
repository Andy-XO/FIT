export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#dfeee6',
        paper: '#05100c',
        emerald2: '#3ddc97',
        teal2: '#5eead4',
        amber2: '#e9a100',
        rust2: '#c85a3c',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
