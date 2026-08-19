import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './index.css'
import PrivacyPage from './pages/Privacy'
import TermsPage from './pages/Terms'

/** Smallest routing for two static legal pages — no router dependency.
 * Normalizes trailing slashes so /terms/ and /privacy/ behave like their
 * canonical paths (hosting may or may not normalize them). */
function normalizePath(p: string): string {
  const clean = p.split('?')[0].split('#')[0]
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1)
  return clean
}

const path = normalizePath(window.location.pathname)

let Root = App
let title = 'AiConnect — Connect AI Agents to Revit, AutoCAD & More'
let description =
  'AiConnect connects AI agents to local engineering software like Revit, AutoCAD, and QGIS, with persistent project context across AI models and sessions.'
if (path === '/terms') {
  Root = TermsPage
  title = 'Terms of Use — AiConnect'
  description =
    'Terms governing the use of AiConnect software, services, connectors, and related offerings.'
} else if (path === '/privacy') {
  Root = PrivacyPage
  title = 'Privacy Policy — AiConnect'
  description =
    'Learn how AiConnect handles information when you use our website, software, and services.'
}

document.title = title
document
  .querySelector('meta[name="description"]')
  ?.setAttribute('content', description)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
    <Analytics />
  </React.StrictMode>,
)
