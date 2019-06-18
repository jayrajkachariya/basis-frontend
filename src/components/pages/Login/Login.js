import React, { Component, Fragment } from 'react';

import './Login.css';
import Button from '../../hoc/Button/Button';
import { isExistingUser, logIn, signUp } from '../../../Api';
import { NotificationManager } from 'react-notifications';
import { Consumer } from '../../../Context';

const Errors = [
  'Email is required!',
  'Invalid email address!',
  'Contact Number is required!',
  'Contact Number should be 10 digits long.',
  'Please enter valid contact number!',
  'Password is required!',
  'Password must be 8 digits long.',
  'First name is required!'
];

class Login extends Component {

  constructor(props) {
    super(props);
    this.PasswordRef = React.createRef();
    this.EmailRef = React.createRef();
  }

  state = {
    contactNumber: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    errors: {
      email: null,
      contactNumber: null,
      firstName: null,
      password: null
    },
    signUp: false,
    login: false,
    isLoading: false
  };

  validateEmail = email => {
    if (!email) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { email: Errors[0] }) };
      });
      return false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { email: Errors[1] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { email: null }) };
      });
      return true;
    }
  };

  validatePassword = password => {
    if (!password || password.length === 0) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { password: Errors[5] }) };
      });
      return false;
    } else if (password.length < 8) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { password: Errors[6] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { password: null }) };
      });
      return true;
    }
  };

  validateName = name => {
    if (!name || name.length === 0) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { firstName: Errors[7] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { firstName: null }) };
      });
      return true;
    }
  };

  validateContactNumber = contactNumber => {
    if (!contactNumber || contactNumber.length === 0) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { contactNumber: Errors[2] }) };
      });
      return false;
    } else if (contactNumber.length !== 10) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { contactNumber: Errors[3] }) };
      });
      return false;
    } else if (!contactNumber.match(/^[0-9]{10}$/)) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { contactNumber: Errors[4] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { contactNumber: null }) };
      });
      return true;
    }
  };

  handleSubmit = (e, provider) => {
    e.preventDefault();
    if (this.state.signUp && !this.state.login) {
      if (!this.validateContactNumber(this.state.contactNumber) ||
        !this.validateEmail(this.state.email) ||
        !this.validateName(this.state.firstName) ||
        !this.validatePassword(this.state.password)
      ) {
        return false;
      } else {
        this.setState(() => {
          return { isLoading: true };
        }, () => this.signUpFunc(provider));
      }
    } else if (!this.state.signUp && this.state.login) {
      if (!this.validateContactNumber(this.state.contactNumber) ||
        !this.validatePassword(this.state.password)) {
        return false;
      } else {
        this.setState(() => {
          return { isLoading: true };
        }, () => this.logInFunc(provider));
      }
    } else if (!this.state.signUp && !this.state.login) {
      if (!this.validateContactNumber(this.state.contactNumber)) {
        return false;
      } else {
        this.setState(() => {
          return { isLoading: true };
        }, this.checkIfExistingUser);
      }
    }
  };

  checkIfExistingUser = () => {
    isExistingUser({ contactNumber: this.state.contactNumber })
      .then(data => {
        if (data.data.success) {
          if (data.data.isExistingUser) {
            this.setState(() => {
              return { login: true };
            }, () => this.PasswordRef.current.focus());
          } else {
            this.setState(() => {
              return { signUp: true };
            }, () => this.EmailRef.current.focus());
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.setState(() => {
          return { isLoading: false };
        });
      });
  };

  logInFunc = provider => {
    logIn({
      contactNumber: this.state.contactNumber,
      password: this.state.password
    }).then(data => {
      if (data.data.success) {
        provider.setUserAfterLogin(data.data.user, data.data.token);
        NotificationManager.info(`Well come back ${data.data.user.firstName}!`);
      } else {
        NotificationManager.error(data.data.message);
      }
    }).catch(err => {
      console.log(err);
      NotificationManager.error('Something went wrong!');
    }).finally(() => {
      this.setState(() => {
        return { isLoading: false };
      });
    });
  };

  signUpFunc = provider => {
    let signUpObject = {
      contactNumber: this.state.contactNumber,
      email: this.state.email,
      firstName: this.state.firstName,
      password: this.state.password
    };
    if (this.state.lastName.toString().trim()) {
      signUpObject.lastName = this.state.lastName.toString().trim();
    }
    signUp(signUpObject).then(data => {
      if (data.data.success) {
        provider.setUserAfterLogin(data.data.user, data.data.token);
        NotificationManager.info(`Well come ${data.data.user.firstName}!`);
      } else {
        NotificationManager.error(data.data.message);
      }
    }).catch(err => {
      console.log(err);
      NotificationManager.error('Something went wrong!');
    }).finally(() => {
      this.setState(() => {
        return { isLoading: false };
      });
    });
  };

  render() {
    return (
      <Consumer>
        {
          provider =>
            <div className="d-flex align-item-center justify-content-center h-100 w-100">
              <div className="bg-light p-3 rounded-highly login-window">
                <h1 className="text-center text-primary font-weight-low">
                  {this.state.signUp ? 'Sign Up' : 'Login'}
                </h1>
                <form onSubmit={event => this.handleSubmit(event, provider)}>

                  <label htmlFor="contact-number" className="text-primary">Contact Number</label>
                  <input
                    type="number"
                    name="contact-number"
                    id='contact-number'
                    onChange={e => this.setState({ contactNumber: e.target.value }, () => this.validateContactNumber(this.state.contactNumber))}
                    value={this.state.contactNumber}
                    placeholder="Enter contact number"
                    className={`input ${Errors.includes(this.state.errors.contactNumber) && 'border-danger'}`}
                  />
                  {this.state.errors.contactNumber && <div className="alert">{this.state.errors.contactNumber}</div>}

                  {this.state.signUp && !this.state.login &&
                  <Fragment>
                    <label htmlFor="email" className="text-primary">Email</label>
                    <input
                      type="email"
                      name="email"
                      id='email'
                      onChange={e => this.setState({ email: e.target.value }, () => this.validateEmail(this.state.email))}
                      value={this.state.email}
                      placeholder="Enter email"
                      className={`input ${Errors.includes(this.state.errors.email) && 'border-danger'}`}
                      ref={this.EmailRef}
                    />
                    {this.state.errors.email && <div className="alert">{this.state.errors.email}</div>}
                    <label htmlFor="first-name" className="text-primary">First Name</label>
                    <input
                      type="text"
                      name="first-name"
                      id='first-name'
                      onChange={e => this.setState({ firstName: e.target.value }, () => this.validateName(this.state.firstName))}
                      value={this.state.firstName}
                      placeholder="Enter first name"
                      className={`input ${Errors.includes(this.state.errors.firstName) && 'border-danger'}`}
                    />
                    {this.state.errors.firstName && <div className="alert">{this.state.errors.firstName}</div>}
                    <label htmlFor="last-name" className="text-primary">Last Name</label>
                    <input
                      type="text"
                      name="last-name"
                      id='last-name'
                      onChange={e => this.setState({ lastName: e.target.value })}
                      value={this.state.lastName}
                      placeholder="Enter last name"
                      className={`input`}
                    />
                  </Fragment>
                  }

                  {(this.state.signUp || this.state.login) &&
                  <Fragment>
                    <label htmlFor="password" className="text-primary">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={e => this.setState({ password: e.target.value }, () => this.validatePassword(this.state.password))}
                      value={this.state.password}
                      placeholder="Enter password"
                      className={`input ${Errors.includes(this.state.errors.password) && 'border-danger'}`}
                      ref={this.PasswordRef}
                    />
                    {this.state.errors.password && <div className="alert">{this.state.errors.password}</div>}
                  </Fragment>
                  }

                  <div className="d-flex align-item-center justify-content-between">
                    {this.state.signUp && <div className="my-1 text-primary letter-spacing-low cursor-pointer" onClick={() => this.setState({
                      signUp: false,
                      login: true
                    })}>
                      <span>Existing User?</span><span className="font-weight-high"> Login </span>
                    </div>}

                    {this.state.login && <div className="my-1 text-primary letter-spacing-low cursor-pointer" onClick={() => this.setState({
                      signUp: true,
                      login: false
                    })}>
                      <span>New User?</span><span className="font-weight-high"> Sign Up </span>
                    </div>}

                    {!this.state.login && !this.state.signUp && <div/>}

                    <Button type="submit"
                            ClassName="my-1 btn-success"
                            loading={this.state.isLoading}>
                      {this.state.signUp ? 'Sign Up' : this.state.login ? 'Login' : 'Submit'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
        }
      </Consumer>
    );
  }
};

export default Login;
