const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors:{
        'dark-blue': "#002B5B",
        'light-red': "#EA5455",
        'cream' : "#E4DCCF",
        'light-cream' : "#F9F5EB"
      }
    },
  },
};
