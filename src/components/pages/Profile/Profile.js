import React, { Component, Fragment } from 'react';
import { Consumer } from '../../../Context';
import './Profile.css';
import Button from '../../hoc/Button/Button';
import { updateUser } from '../../../Api';
import { NotificationManager } from 'react-notifications';

const InformationRow = ({ name, value }) => (
  <div className="d-flex align-item-center my-1">
    <div className="f-1 text-right px-1 font-weight-high">{name}</div>
    <div className="f-1 px-1">{value}</div>
  </div>
);

const NormalMode = ({ provider, activateEditMode }) => (
  <Fragment>
    <Button
      ClassName="absolute top right"
      onClick={activateEditMode}
    >Edit</Button>
    <h1 className="text-center text-primary font-weight-low letter-spacing-low">Profile</h1>
    <InformationRow name="Contact Number" value={provider.user.contactNumber}/>
    <InformationRow name="Name"
                    value={provider.user.firstName + provider.user.firstName ? ` ${provider.user.firstName}` : ''}/>
    <InformationRow name="Email" value={provider.user.email}/>
  </Fragment>
);

const Errors = [
  'Email is required!',
  'Invalid email address!',
  'First name is required!'
];

class EditMode extends Component {
  state = {
    email: '',
    firstName: '',
    lastName: '',
    errors: {
      email: null,
      firstName: null
    },
    isLoading: false
  };

  componentDidMount() {
    this.setState(() => {
      return {
        email: this.props.existingUser.email,
        firstName: this.props.existingUser.firstName,
        lastName: this.props.existingUser.lastName
      };
    });
  }

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

  validateName = name => {
    if (!name || name.length === 0) {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { firstName: Errors[2] }) };
      });
      return false;
    } else {
      this.setState(prevState => {
        return { errors: Object.assign({}, { ...prevState.errors }, { firstName: null }) };
      });
      return true;
    }
  };

  handleSubmit = (e, provider) => {
    e.preventDefault();
    if (!this.validateEmail(this.state.email.trim()) || !this.validateName(this.state.firstName.trim())
    ) {
      return false;
    } else {
      this.setState(() => {
        return { isLoading: true };
      }, () => this.updateUserFunc(provider));
    }
  };

  updateUserFunc = provider => {
    let updateUserObject = {
      email: this.state.email.trim(),
      firstName: this.state.firstName.trim()
    };
    if (this.state.lastName.trim()) {
      updateUserObject.lastName = this.state.lastName.trim();
    }
    updateUser(updateUserObject, provider.token).then(data => {
      if (data.data.success) {
        provider.setUserAfterLogin(data.data.user, provider.token);
        NotificationManager.success(data.data.message);
        this.props.cancelEditMode();
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
            <Fragment>
              <h1 className="text-center text-primary font-weight-low letter-spacing-low">Edit Profile</h1>
              <form onSubmit={event => this.handleSubmit(event, provider)}>
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

                <div className="d-flex align-item-center justify-content-between">
                  <Button onClick={this.props.cancelEditMode}
                          ClassName="btn-danger">
                    Cancel
                  </Button>
                  <Button type="submit"
                          ClassName="my-1"
                          loading={this.state.isLoading}>
                    Save
                  </Button>
                </div>
              </form>
            </Fragment>
        }
      </Consumer>
    );
  }
}

class Profile extends Component {
  state = {
    editMode: false
  };

  render() {
    return (
      <Consumer>
        {provider =>
          <div className="d-flex align-item-center justify-content-center f-1">
            <div className="bg-light p-3 rounded-highly login-window relative">
              {
                this.state.editMode ?
                  <EditMode
                    existingUser={{ ...provider.user }}
                    cancelEditMode={() => this.setState({ editMode: false })}/> :
                  <NormalMode
                    provider={provider}
                    activateEditMode={() => this.setState({ editMode: true })}/>
              }
            </div>
          </div>
        }
      </Consumer>
    );
  }
}

export default Profile;
