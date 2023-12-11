const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  plugins: [require('daisyui')],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'dark-blue-200': '#002B5B',
        'dark-blue-100': '#063d7a',
        'light-red': '#EA5455',
        cream: '#E4DCCF',
        'light-cream': '#F9F5EB',
      },
    },
  },
  daisyui: {
    themes: [
      {
        cupcake: {
          ...require('daisyui/src/theming/themes')['cupcake'], // import cupcake theme
          
        },
      },
      'cmyk',
    ],
  },
};
