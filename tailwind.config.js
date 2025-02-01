/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',        // Includes files in the app directory (new Next.js 13+ app router)
    './pages/**/*.{js,ts,jsx,tsx}',      // Includes files in the pages directory (Next.js pages router)
    './components/**/*.{js,ts,jsx,tsx}', // Includes files in the components directory
    './src/**/*.{js,ts,jsx,tsx}',        // Includes files in the src directory if you're using that structure
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
