import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT,
    allowedHosts: ["itse-2374-app-4-front-5.onrender.com"]
  }
})