import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/adaptacionBase/' : '/',
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Fuerza a Vite a revisar cambios constantemente
    },
  },
})
