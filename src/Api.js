import axios from 'axios';

const URL = 'https://basis-backend.herokuapp.com';

const isExistingUser = async body => {
  try {
    return await axios({
      method: 'post',
      url: `${URL}/user/user-authentication`,
      data: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const signUp = async body => {
  try {
    return await axios({
      method: 'post',
      url: `${URL}/user/sign-up`,
      data: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const logIn = async (body) => {
  try {
    return await axios({
      method: 'post',
      url: `${URL}/user/login`,
      data: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (body, token) => {
  try {
    return await axios({
      method: 'patch',
      url: `${URL}/user/update-user`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const changePassword = async (body, token) => {
  try {
    return await axios({
      method: 'patch',
      url: `${URL}/user/update-password`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const getUser = async token => {
  try {
    return await axios({
      method: 'get',
      url: `${URL}/user/fetch-user`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export {signUp, logIn, updateUser, changePassword, getUser, isExistingUser};
