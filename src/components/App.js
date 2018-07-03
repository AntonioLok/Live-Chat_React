import React, { Component } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import Chat from './Chat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import './../styles/App.css';

class App extends Component {
  state = {
    users : null
  };

  checkAuthorization() {
    if (sessionStorage.getItem("access") === "true") {
      return <Chat />;
    } else {
    return (<Redirect to="/login" />);
    }
  }

  render() {

    return (
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/chat" render={() => this.checkAuthorization()} />
            <Route exact path="*" render={() => <h1> Error 404, Page does not exist </h1>} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
