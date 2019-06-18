import React, { Component } from 'react';
import { Consumer } from '../../../Context';
import Button from '../../hoc/Button/Button';
import { changePassword } from '../../../Api';
import { NotificationManager } from 'react-notifications';

const Errors = [
  'Password is required!',
  'Password must be 8 digits long.',
  'Confirm password is required!',
  'Password and Confirm password must match!'
];

export default class ChangePassword extends Component {
  state = {
    password: '',
    confirmPassword: '',
    errors: {
      password: null,
      confirmPassword: null
    },
    isLoading: false
  };


  validatePassword = password => {
    if (!password || password.length === 0) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { password: Errors[0] }) };
      });
      return false;
    } else if (password.length < 8) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { password: Errors[1] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { password: null }) };
      });
      return true;
    }
  };

  validateConfirmPassword = password => {
    if (!password || password.length === 0) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { confirmPassword: Errors[2] }) };
      });
      return false;
    } else if (password.trim() !== this.state.password.trim()) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { confirmPassword: Errors[3] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { confirmPassword: null }) };
      });
      return true;
    }
  };

  handleSubmit = (e, provider) => {
    e.preventDefault();
    if (!this.validatePassword(this.state.password.trim()) || !this.validateConfirmPassword(this.state.confirmPassword.trim())) {
      return false;
    } else {
      this.setState(() => {
        return { isLoading: true };
      }, () => this.changePasswordFunc(provider));
    }
  };

  changePasswordFunc = provider => {
    changePassword({ password: this.state.password.trim() }, provider.token).then(data => {
      if (data.data.success) {
        console.log(data.data);
        NotificationManager.success(data.data.message);
      } else {
        NotificationManager.error(data.data.message);
      }
    }).catch(err => {
      console.log(err);
      NotificationManager.error('Something went wrong!');
    }).finally(() => {
      this.setState(() => {
        return {
          password: '',
          confirmPassword: '',
          errors: {
            password: null,
            confirmPassword: null
          },
          isLoading: false
        };
      });
    });
  };

  render() {
    return (
      <Consumer>
        {provider =>
          <div className="d-flex align-item-center justify-content-center f-1">
            <div className="bg-light p-3 rounded-highly login-window">
              <h1 className="text-center text-primary font-weight-low letter-spacing-low">Change Password</h1>
              <br/>
              <form onSubmit={event => this.handleSubmit(event, provider)} className="my-1">

                <label htmlFor="password" className="text-primary">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={e => this.setState({ password: e.target.value }, () => this.validatePassword(this.state.password))}
                  value={this.state.password}
                  placeholder="Enter password"
                  className={`input ${Errors.includes(this.state.errors.password) && 'border-danger'}`}
                />
                {this.state.errors.password && <div className="alert">{this.state.errors.password}</div>}

                <label htmlFor="confirm-password" className="text-primary">Confirm Password</label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  onChange={e => this.setState({ confirmPassword: e.target.value }, () => this.validateConfirmPassword(this.state.confirmPassword))}
                  value={this.state.confirmPassword}
                  placeholder="Enter password again"
                  className={`input ${Errors.includes(this.state.errors.confirmPassword) && 'border-danger'}`}
                />
                {this.state.errors.confirmPassword && <div className="alert">{this.state.errors.confirmPassword}</div>}

                <div className="d-flex align-item-center justify-content-end">
                  <Button type="submit"
                          ClassName="my-1"
                          loading={this.state.isLoading}>
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        }
      </Consumer>
    );
  }
}
