import React, { Component } from 'react';
import io from "socket.io-client";
import './../styles/Chat.css';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user : sessionStorage.getItem("user"),
      users : localStorage.getItem("users") ? localStorage.getItem("users").split(",") : [],
      messageSent : "",
      messages : localStorage.getItem("msgs") ? JSON.parse(localStorage.getItem("msgs")) : [],
    }

    this.socket = io('localhost:3000/', {transports: ['websocket'], upgrade: false});
  }

  componentDidUpdate () {
    var el = this.refs.wrap;
    el.scrollTop = el.scrollHeight;
  }

  handleChange(event) {
    this.setState({messageSent: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var message = {author: this.state.user, message: this.state.messageSent};
    this.socket.emit("add-message", message);
    this.setState({messageSent: ""});
  }

  render() {
    this.socket.emit("update-users-server", this.state.users, this.state.messages);
    this.socket.emit("add-user", this.state.user);
    
    this.socket.on('update-users-client', (data) => {
      this.setState({users: data.users});
      localStorage.setItem("users", data.users);
    });

    this.socket.on('update-messages', (data) => {
      this.setState({messages: data.messages});
      localStorage.setItem("msgs", JSON.stringify(data.messages));
    });

    const users = [];
    for (var i = 0; i < this.state.users.length; i++ ){
      if (this.state.users[i] !== this.state.user)
      users.push(<div className="user" key={i}> {this.state.users[i]} </div>);
    }

    const userLists = (
      <div className="user-lists">
        <div className="userTitle"> Users Online: </div>
        {users}
      </div>
    );

    const messages = []    
    for (var j = 0; j < this.state.messages.length; j++ ){
      messages.push(<div className="msg" key={j}> {this.state.messages[j].author}
         : {" " + this.state.messages[j].message} </div>);
    }
    
    const displayMessages = (
      <div ref="wrap" className="display-messages"  >  
        {messages}
      </div>
    );

    const takeInputs = (
      <form className="enter-messages" onSubmit={(event) => this.handleSubmit(event)}>
        <input className="userInput" type="text" placeholder="type new message" 
          name={this.state.messageSent} value={this.state.messageSent} onChange={(event) => this.handleChange(event)}/>
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
