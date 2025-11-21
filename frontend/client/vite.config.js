import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Proyecto-final-JC/',
  server: {
    port: 5173,
      }
})