import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.js'

import { AuthProvider } from './context/AuthProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/** * The AuthProvider wraps the entire App to provide
         * global access to user session and JWT handling.
         */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
)