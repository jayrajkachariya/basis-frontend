import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from './Context';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
  <Provider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>, document.getElementById('root'));

serviceWorker.unregister();
