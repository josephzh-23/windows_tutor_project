import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/login.css'
// import './index.css';
import './assets/style.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContextProvider } from './Reusable/UserContext';


ReactDOM.render(

  <UserContextProvider>
  <App />
  </UserContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
