module.exports = {
    plugins: [
      require('postcss-import'),
      require('postcss-nesting'), // Agrega esto antes de Tailwind
      require('tailwindcss'),
      require('autoprefixer'),
    ]
  };
  