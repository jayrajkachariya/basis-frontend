import React, { Component } from 'react';
import { getUser } from './Api';

const Context = React.createContext();

class Provider extends Component {
  state = {
    loggedIn: false,
    user: null,
    token: null,
    isLoading: false
  };

  componentDidMount() {
    this.loginUser();
  }

  loginUser = () => {
    let token = localStorage.getItem('BASIS_AUTH_TOKEN');
    if (token) {
      this.setState(() => {
        return { isLoading: true };
      }, () => {
        getUser(token)
          .then(res => {
            if (res.data.success) {
              this.setState(() => {
                return { token: token, loggedIn: true, user: res.data.user };
              });
            } else {
              this.onLogOut();
            }
          })
          .catch(err => {
            this.onLogOut();
          })
          .finally(() => {
            this.setState(() => {
              return {isLoading: false}
            })
          })
      });
    }
  };

  onLogOut = () => {
    localStorage.removeItem('BASIS_AUTH_TOKEN');
    this.setState(() => {
      return { token: null, loggedIn: false, user: null };
    });
  };

  setUserAfterLogin = (user, token) => {
    if (localStorage.getItem('BASIS_AUTH_TOKEN')) {
      localStorage.removeItem('BASIS_AUTH_TOKEN');
    }
    localStorage.setItem('BASIS_AUTH_TOKEN', token);
    this.setState(() => {
      return { user: user, token: token, loggedIn: true };
    });
  };

  render() {
    return (
      <Context.Provider value={{
        ...this.state,
        setUserAfterLogin: this.setUserAfterLogin,
        onLogOut: this.onLogOut
      }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

const Consumer = Context.Consumer;

export { Provider, Consumer };
