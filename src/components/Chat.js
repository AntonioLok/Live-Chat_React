import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import  { Redirect } from 'react-router-dom';
import io from "socket.io-client";
import './../styles/Chat.css';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user : sessionStorage.getItem("user"),
      users : localStorage.getItem("users") ? localStorage.getItem("users").split(",") : [],
      messageSent : "",
      messages : ["HELLO", "OH HII"]
    }
    this.socket = io('localhost:8000/', {transports: ['websocket'], upgrade: false});
  }

  handleChange(event) {
    this.setState({messageSent: event.target.value});
  }

  handleSubmit(event) {
    alert(this.state.messageSent);
  }

  render() {
    console.log(this.state.users, this.state.user);

    this.socket.emit("update-users-server", this.state.users);
    this.socket.emit("add-user", this.state.user);
    this.socket.on('update-users-client', (data) => {
      this.setState({users: data.users});
      localStorage.setItem("users", data.users);
      //this.forceUpdate();
    });
    
    
    const users = [];
    for (var i = 0; i < this.state.users.length; i++ ){
      if (this.state.users[i] != this.state.user)
      users.push(<div className="user" key={i}> {this.state.users[i]} </div>);
    }

    const userLists = (
      <div className="user-lists">
        <h1> Users Online: </h1>
        {users}
      </div>
    );

    const messages = []    
    for (var i = 0; i < this.state.messages.length; i++ ){
      messages.push(<div className="msg" key={i}> {this.state.messages[i]} </div>);
    }
    const displayMessages = (
      <div className="display-messages" >  
        {messages} 
      </div>
    );

    const takeInputs = (
      <form className="enter-messages" onSubmit={(event) => this.handleSubmit(event)}>
        <input className="userInput" type="text" placeholder="type new message" 
          name={this.state.messageSent} onChange={(event) => this.handleChange(event)}/>
        <input className="send" type="submit" value="Send" />
      </form>
    );

    return (
      <div className="chat-container">
        <div className="left-component">
          {userLists}
        </div>
        <div className="right-component">
          {displayMessages}
          {takeInputs}
        </div>
      </div>
    );
  }
}


export default Chat;
