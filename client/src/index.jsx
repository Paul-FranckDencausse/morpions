import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import App from './App';
import store from './store';

import 'react-toastify/dist/ReactToastify.css';
import "uikit/dist/css/uikit.min.css";
import "./index.scss";

import "uikit/dist/js/uikit.min.js";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ToastContainer hideProgressBar={true} autoClose={3000} theme="colored" />
      <App />
    </Provider>
  </BrowserRouter>
);
