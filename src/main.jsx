import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root')
const app = <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>
// Prerendered pages are hydrated; anything else (e.g. vite dev) renders fresh.
if (root.hasChildNodes() && root.firstChild.nodeType === 1) hydrateRoot(root, app)
else createRoot(root).render(app)
