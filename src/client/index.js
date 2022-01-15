import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MyStore from './store/saga';
// import './index.css';
import './styles/style.css';
import App from './app.jsx';

// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={MyStore}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
