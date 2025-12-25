/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'anta': ['Anta', 'sans-serif'],
      },
    },
  },
  safelist: [
    // Category colors - bg classes
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500',
    'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-indigo-500', 'bg-violet-500', 'bg-gray-500',
    
    // Category colors - text classes
    'text-blue-400', 'text-purple-400', 'text-pink-400', 'text-red-400',
    'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-teal-400',
    'text-cyan-400', 'text-indigo-400', 'text-violet-400', 'text-gray-400',
    
    // Category colors - border classes
    'border-blue-500/30', 'border-purple-500/30', 'border-pink-500/30', 'border-red-500/30',
    'border-orange-500/30', 'border-yellow-500/30', 'border-green-500/30', 'border-teal-500/30',
    'border-cyan-500/30', 'border-indigo-500/30', 'border-violet-500/30', 'border-gray-500/30',
    
    // Category colors - background alpha classes
    'bg-blue-900/10', 'bg-purple-900/10', 'bg-pink-900/10', 'bg-red-900/10',
    'bg-orange-900/10', 'bg-yellow-900/10', 'bg-green-900/10', 'bg-teal-900/10',
    'bg-cyan-900/10', 'bg-indigo-900/10', 'bg-violet-900/10', 'bg-gray-900/10',
  ],
}
