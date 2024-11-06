// import React from 'react';

import HomePage from './Pages/HomePage';
import ImageDetails from './Pages/ImageDetails';
import './App.css';
import {
createBrowserRouter,RouterProvider
} from "react-router-dom"


const router=createBrowserRouter(
  [//array of objects
    {
      path: '/',
      element: <HomePage />, //  for the root path
    },
    {
      path: '/image/:id', //  route for image details
      element: <ImageDetails />,}
         
  ]
)

function App() {
  return (

    <RouterProvider router={router} /> 
   
  );
}

export default App;
