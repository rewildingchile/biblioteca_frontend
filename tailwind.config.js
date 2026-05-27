const colors = require("tailwindcss/colors")
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/vue-tailwind-datepicker/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "vtd-primary": colors.sky, // Light mode Datepicker color
        "vtd-secondary": colors.gray, // Dark mode Datepicker color
        "vtd-terciary": colors.purple, // Dark mode Datepicker color
        purple: {
          450: '#9333ea'
        },
        backgroundImage: {
           'bg-login': "url('/images/clouds-intro.jpg')",
        }
        //background-repeat: no-repeat;  background-size: cover; background-image:url('images/clouds-intro.jpg'); background-position: center;

      },
      width: {
        '3/10': '30%',
        '7/10': '70%',
        '20': '20%',
        '25': '25%',
        '38': '38%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}