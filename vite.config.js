import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

server:{
  host:false
}

export default defineConfig({
  plugins: [react()],
})