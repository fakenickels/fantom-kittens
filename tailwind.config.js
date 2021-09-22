module.exports = {
  mode: "jit",
  purge: [
    "src/**/*.{res,ts}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Press Start 2P"'],
        sans: [`"Open Sans"`, 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
