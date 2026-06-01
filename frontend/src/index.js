import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './axiosConfig'; // Initialize axios interceptor for API base URL
import App from './App';
import reportWebVitals from './reportWebVitals';

// Set body background using PUBLIC_URL so images in `public/` are used
const publicUrl = process.env.PUBLIC_URL || '';
const bg1 = `${publicUrl}/images/background.jpeg`;
const bg2 = `${publicUrl}/images/background.png`;
const remote = 'https://copilot.microsoft.com/th/id/BCO.1fccac32-627e-42cd-a386-726ddbf98795.png';
document.body.style.backgroundImage = `url("${bg1}"), url("${bg2}"), url("${remote}")`;
document.body.style.backgroundRepeat = 'no-repeat, no-repeat, no-repeat';
document.body.style.backgroundPosition = 'center center, center center, center center';
document.body.style.backgroundSize = 'cover, cover, cover';
document.body.style.backgroundColor = '#eef5ff';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
