import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Esto expone tu frontend a toda la red
    port: 5173, // (opcional) puedes cambiarlo si ya está ocupado
  },
})
