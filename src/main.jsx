import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n.js' // Initialize i18n
import App from './App.jsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element "#root" was not found in index.html')
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Application bootstrap failed:', error)
  rootElement.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f9fafb;padding:16px;font-family:system-ui,sans-serif;">
      <div style="max-width:540px;text-align:center;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;box-shadow:0 4px 10px rgba(0,0,0,0.06);">
        <h1 style="margin:0 0 8px;font-size:20px;color:#111827;">Application failed to start</h1>
        <p style="margin:0 0 12px;color:#4b5563;">A runtime error blocked the UI initialization.</p>
        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;background:#f3f4f6;border-radius:8px;padding:12px;text-align:left;color:#111827;">${error?.message || 'Unknown startup error'}</pre>
      </div>
    </div>
  `
}
