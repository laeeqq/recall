import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // adding the tailwindcss plugin


export default defineConfig({
  plugins: [react(), tailwindcss()], // adding the tailwindcss plugin to the vite config
})


