import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Redirect } from 'react-router-dom';
import './../styles/Signup.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : "",
      password : "" ,
      repassword : "",
      errorUsername : null,
      errorPassword : null,
      redirect: null,
    }
  }

  async signUp(userUsername, userPassword) {
    await fetch('http://localhost:8000/api/sign-up', {
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
      data.success ? this.redirect() : alert(data.message);
    });
  }

  redirect() {
    this.setState({
      redirect: <Redirect to="/login" />
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name] : value});
  }

  handleSubmit(event) {
    if (this.state.username == "") {
      this.setState({errorUsername : "Username field cannot be empty"});
    }  

    if (this.state.password != this.state.repassword) {
      this.setState({errorPassword: "Password does not match"});
    } 

    if (this.state.username != "" && this.state.password == this.state.repassword) {
      this.setState({
        errorUsername : null,
        errorPassword: null
      })
      this.signUp(this.state.username, this.state.password);
    }

    event.preventDefault();
  }

  render() {
    return (
      <div className="signUp-container">
        {this.state.test}
        <form id="login" onSubmit={(event) => this.handleSubmit(event)}>
          <div className="input"> Username: <input type="text" name="username"
            value={this.state.username} onChange={(event) => this.handleChange(event)}/> </div>
          <div className= "alert"> {this.state.errorUsername ? this.state.errorUsername : null} </div>
          <div className="input"> Password: <input type="password" name="password"
            value={this.state.password} onChange={(event) => this.handleChange(event)}/> </div>
          <div className="input"> Re-enter Password: <input type="password" name="repassword"
            value={this.state.repassword} onChange={(event) => this.handleChange(event)}/> </div>
          <div className= "alert"> {this.state.errorPassword ? this.state.errorPassword : null} </div>
          <input className="btn" type="submit" value="Register me!"/>
        </form>
        {this.state.redirect}
      </div>
    );
  }
}

export default SignUp;