module.exports = {
  style: {
    postcss: {
      plugins: [
        require('@tailwindcss/postcss'),
        require('autoprefixer'),
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')
      ],
    },
  },
}