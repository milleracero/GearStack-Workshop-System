import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.js'
// Importamos AuthProvider desde su nuevo archivo independiente .js
import { AuthProvider } from './context/AuthProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
)