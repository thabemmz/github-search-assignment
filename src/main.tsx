import React from 'react'
import ReactDOM from 'react-dom/client'
import Search from './pages/search/index.tsx'
import { History } from './pages/history'
import './index.css'
import {QueryProvider} from "./providers/QueryProvider";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <QueryProvider><Search /></QueryProvider>,
  },
  {
    path: '/history',
    element: <History />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
