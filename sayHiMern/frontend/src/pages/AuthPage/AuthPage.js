import React, { Component } from 'react';
import './AuthPage.css';
import AuthContext from '../../context/auth-context';
import { Button, TextField } from '@material-ui/core';

export class AuthPage extends Component {
  state = {
    isLogin: true,
  };
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let requestBody = {
      query: `
          query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              userId
              token
              tokenExpiration
            }
          }
        `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
        },
      };
    }
    fetch('http://localhost:8000/smartBookingApi', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          console.log(resData.data.login);
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className="auth-form">
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <TextField
            type="email"
            id="email"
            inputRef={this.emailEl}
            variant="standard"
          />
        </div>
        <div className="form-control">
          <label htmlFor="email">Password</label>
          <TextField
            type="password"
            id="password"
            inputRef={this.passwordEl}
            variant="standard"
          />
        </div>
        <div className="form-actions">
          <Button
            className="btnSignUp"
            variant="outlined"
            color="secondary"
            onClick={this.submitHandler}
          >
            Sign Up
          </Button>
          <Button
            className="btnSignIn"
            variant="outlined"
            color="primary"
            onClick={this.submitHandler}
          >
            Sign In
          </Button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
