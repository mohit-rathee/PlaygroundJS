import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class', // Enable dark mode using the 'class' strategy
    theme: {
        extend: {
            colors: {
                'dark-bag': '#2C3441',
                'word': '#d3d3d3'
            }
        },
    },
    plugins: [],
};

export default config;
