import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import Search from './pages/SearchPage';
import BlogPage from './pages/BlogPage';
import LogIn from './pages/LogIn';
import SignUp from './pages/Signup';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ProtectedRoute from './component/ProtectedRoutes';
import SearchPage from './pages/SearchPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute logo={true}><SearchPage/></ProtectedRoute>,
  },
  {
    path: "/blog/:id",
    element: <BlogPage/>,
  },
  {
    path: "/login",
    element: <LogIn/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
  {
    path: "/search/:tag",
    element: <ResultPage/>,
  },
  {
    path: "/history",
    element: <ProtectedRoute logo={true}><HistoryPage/></ProtectedRoute>,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
