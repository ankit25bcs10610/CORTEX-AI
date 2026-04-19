/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090e1c",
        panel: "#10192e",
        panel2: "#17233f",
        accent: "#32d3a8",
        accent2: "#4f8dff",
        warn: "#f59e0b",
        danger: "#ef4444"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(79,141,255,0.2), 0 8px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
