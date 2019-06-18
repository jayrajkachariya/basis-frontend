import React, { Component, Fragment } from 'react';
import Button from '../../hoc/Button/Button';
import { Switch, Route, Link } from 'react-router-dom';

import { Consumer } from '../../../Context';
import ChangePassword from '../ChangePassword/ChangePassword';
import Profile from '../Profile/Profile';

const Routes = () => (
  <Switch>
    <Route path='/change-password' component={ChangePassword}/>
    <Route path='/' exact component={Profile}/>
    <Route component={Profile}/>
  </Switch>
);

const PathSelector = ({ provider }) => (
  <Fragment>
    <Link to="/">
      <Button ClassName="border-transparent mr-1">
        Profile
      </Button>
    </Link>
    <Link to="/change-password">
      <Button ClassName="border-transparent mr-1">
        Change Password
      </Button>
    </Link>
    <Link to="/">
      <Button onClick={provider.onLogOut} ClassName="btn-danger">
        Logout
      </Button>
    </Link>
  </Fragment>
);

export default class Dashboard extends Component {
  render() {
    return (
      <div className="h-100 w-100 d-flex flex-column">
        <div className="header">
          <Consumer>
            {provider =>
              <Fragment>
                <div className="text-capitalize">Hi {provider.user.firstName}!</div>
                <div className="d-flex align-item-center letter-spacing-low">
                  <PathSelector provider={provider}/>
                </div>
              </Fragment>
            }
          </Consumer>
        </div>
        <Routes/>
      </div>
    );
  }
}
