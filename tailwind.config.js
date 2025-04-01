const primeui = require('tailwindcss-primeui');
const tailwindScrollbar = require('tailwind-scrollbar');

export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    plugins: [primeui]
};
