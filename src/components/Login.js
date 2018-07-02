import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import io from "socket.io-client";

import './../styles/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : "",
      password : "",
      errorUsername: null,
      errorPassword: null,
      redirect: null
    };
  }

  componentDidMount() {

  }

  async logIn(userUsername, userPassword) {
    await fetch('http://localhost:8000/api/log-in', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userUsername,
        password: userPassword,
      })
    })
    .then((response) => {
      if (response.status === 400) {
        throw new Error(`Could not fetch data`);
      }
      return response.json()}
    )
    .then(data => {
      data.success ? this.update() : alert(data.message);
    });
  }

  update() {
    sessionStorage.setItem("access", true);
    sessionStorage.setItem("user", this.state.username);
    this.setState({
      errorUsername : null,
      errorPassword: null,
      redirect: <Redirect to={
        {pathname: '/chat'
         //state: {user: this.state.username}
        }
      } />
    })
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name] : value});
  }

  handleSubmit(event) {
    if (this.state.username == "") {
      this.setState({errorUsername : "Username field cannot be empty"});
    }  

    if (this.state.password == "") {
      this.setState({errorPassword : "Password field cannot be empty"});
    } 

    if (this.state.username != "" && this.state.password != "") {
      this.logIn(this.state.username, this.state.password);
    }

    event.preventDefault();
  }

  render() {
    return (
      <div className="logIn-container">
        <form id="login" onSubmit={(event) => this.handleSubmit(event)}>
          <div className="input"> Username: <input type="text" name="username"
            value={this.state.username} onChange={(event) => this.handleChange(event)}/> </div>
          <div className="alert"> {this.state.errorUsername ? this.state.errorUsername : null} </div>
          <div className="input"> Password: <input type="password" name="password"
            value={this.state.password} onChange={(event) => this.handleChange(event)} /> </div>
          <div className="alert"> {this.state.errorPassword ? this.state.errorPassword : null} </div>
          <input className="btn" type="submit" value="Log in!"/>
          <Link to="/signup"> Don't have an account? </Link>
        </form>
        {this.state.redirect}
      </div>
    );
  }
}

export default Login;
