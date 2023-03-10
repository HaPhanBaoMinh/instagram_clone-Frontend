import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./redux/reducer";

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(reducers, applyMiddleware(thunk));

root.render(
  // <React.StrictMode>
  <AuthProvider >
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>
  // </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
