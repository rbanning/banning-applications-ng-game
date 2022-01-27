const colors = require('tailwindcss/colors');
//const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  theme: {
    extend: {},
    colors: {
      //keep the current colors
      ...colors,
      //add new colors
      'cornflower-blue': {
        DEFAULT: '#6DADE9',
        '50': '#FFFFFF',
        '100': '#FBFDFE',
        '200': '#D7E9F9',
        '300': '#B4D5F4',
        '400': '#90C1EE',
        '500': '#6DADE9',
        '600': '#3C92E2',
        '700': '#1E76C8',
        '800': '#175997',
        '900': '#0F3C66'
      },
      'retro-blue': {
        DEFAULT: '#95CAD7',
        '50': '#FFFFFF',
        '100': '#FFFFFF',
        '200': '#EEF6F9',
        '300': '#D0E8ED',
        '400': '#B3D9E2',
        '500': '#95CAD7',
        '600': '#6CB6C8',
        '700': '#45A0B7',
        '800': '#367D8E',
        '900': '#265965'
        },
      
    }
  },
  plugins: []}
