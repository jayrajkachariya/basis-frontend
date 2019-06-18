import React, { Component } from 'react';
import './App.css';
import { Consumer } from './Context';

import Login from './components/pages/Login/Login';
import { NotificationContainer } from 'react-notifications';
import Dashboard from './components/pages/Dashboard/Dashboard';

const Loading = () => (
  <div className="d-flex align-item-center justify-content-center font-size-large font-weight-low h-100 w-100">
    Loading...
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="container">
        <Consumer>
          {provider =>
            provider.isLoading
              ?
              <Loading/>
              :
              provider.loggedIn
                ?
                <Dashboard {...this.props}/>
                :
                <Login/>
          }
        </Consumer>
        <NotificationContainer/>
      </div>
    );
  }
}

export default App;
