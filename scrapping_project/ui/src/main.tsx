import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Search from './pages/SearchPage';
import BlogPage from './pages/BlogPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Search/>,
  },
  {
    path: "/blog/:id",
    element: <BlogPage/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
