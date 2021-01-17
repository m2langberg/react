import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';


import { PrivateRoute } from '../components/PrivateRoute';

import AboutPage from '../pages/AboutPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProjectPage from '../pages/ProjectPage';
import TopBar from '../components/TopBar';


import { User } from '../models/users';
import { userService } from '../services/user.service';

import './App.css';

interface Props {
}

interface State {
  user: User | null
}


class App extends React.Component<Props, State> {
  state: Readonly<State> = {
    user: userService.getUser()
  }

  constructor(props: Props) {
    super(props);


    this.loginStateChanged = this.loginStateChanged.bind(this);
  }

  loginStateChanged(user: User) {
    this.setState({ user: user });
  }

  render() {
    return (
      <Router>
        <TopBar
          user={this.state.user}
        />
        <Switch>
          <Route
            path="/login"
            render={(props) => <LoginPage {...props} loginStateChanged={this.loginStateChanged} />}
          />
          <PrivateRoute exact path='/'>
            <Redirect to="/projects" />
          </PrivateRoute>
          <PrivateRoute path='/about' component={AboutPage} />
          <PrivateRoute path='/home' component={HomePage} />
          <PrivateRoute path='/projects' component={ProjectPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
