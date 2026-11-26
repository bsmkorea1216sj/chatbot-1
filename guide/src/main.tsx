import React from 'react'
import ReactDOM from 'react-dom/client'
import './polyfills'
import '@cloudscape-design/global-styles/index.css'
import App from './App'
import './index.css'
import './styles/guide-badges.css'
import './styles/navigation.css'
import './styles/accessibility.css'
import './styles/print.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)