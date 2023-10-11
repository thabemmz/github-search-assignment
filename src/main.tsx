import React from 'react'
import ReactDOM from 'react-dom/client'
import Search from './pages/search/index.tsx'
import './index.css'
import {QueryProvider} from "./providers/QueryProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider><Search /></QueryProvider>
  </React.StrictMode>,
)
