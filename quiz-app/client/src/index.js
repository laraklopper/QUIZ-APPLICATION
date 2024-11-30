// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
import ReactDOM from 'react-dom/client';// Import the ReactDOM library, to provide a method rendering React components into the DOM
import './index.css';//Import CSS stylesheet
import App from './App';//Import the App function component
import reportWebVitals from './reportWebVitals';//Import reportWebVitals function from './reportWebVitals'
import 'bootstrap/dist/css/bootstrap.min.css';//Import React Bootstrap
import { BrowserRouter } from 'react-router-dom';//Import BrowserRouter from react-router-dom;

// Create a root for rendering the React app using the element id
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>{/* Enable additional checks and warnings during development */}
    
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
