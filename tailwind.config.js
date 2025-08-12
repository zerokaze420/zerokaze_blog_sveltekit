// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    // 确保这个路径包含了你的所有组件文件
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'pre': false,
            'code': false,
            'pre code': false,
            'code::before': false,
            'code::after': false,
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};