
import * as React from 'react';
import { NavLink } from 'react-router-dom';


import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Image from "react-bootstrap/Image";
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';



import { User } from '../models/users';
//import { userService } from '../services/user.service';

import logo from '../images/logo.png';

import './TopBar.css';


interface Props {
  user: User | null
}


interface State {
  working: boolean
}

class TopBar extends React.Component<Props, State> {

  state: Readonly<State> = {
    working: false
  }

  /*
  constructor(props: Props) {
    super(props);
  }
  */

  componentDidMount() {
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
  }



  render() {
    let login;
    if (this.props.user !== null) {
      const text = 'Logged in as ' + this.props.user.first_name + ' ' + this.props.user.last_name;
      const navDropdownTitle = (
        <Image
          className="avatar"
          alt={text}
          src="/icons/no_avatar.png"
          roundedCircle
        />
      );
      login = (
        <Nav title={text}>
          <Navbar.Text>
            <Button href="/inbox" variant="light" size="sm" className="mx-1">
              Unread <Badge variant="light">0</Badge>
              <span className="sr-only">unread messages</span>
            </Button>
          </Navbar.Text>
          <NavDropdown id="userprofile" title={navDropdownTitle} alignRight>
            <NavDropdown.Item disabled href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/login">Log out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      )
    } else {
      login = (
        <Navbar.Text className="mx-4">
          <a href="/login">Log in</a>
        </Navbar.Text>
      )
    }

    return (
      <Navbar bg="light" expand="lg" sticky="top">

        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            height="36"
            className="d-inline-block align-top"
          />{' '}
                React Projects
              </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" >
            <Nav.Link as={NavLink} to="/projects">Projects</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
          </Nav>
          <Form>
          <InputGroup>
              <FormControl
                placeholder="Search"
                aria-label="Username"
                aria-describedby="search-addon1"
              />
              <InputGroup.Append>
                <Button id="search-addon1" variant="outline-secondary">
                  <span className="fas fa-search"></span>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
          <Navbar fixed="bottom">
            <Navbar.Text>
              {this.state.working &&
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              }
            </Navbar.Text>
          </Navbar>

        </Navbar.Collapse>
        { login}
      </Navbar>
    );
  }
}

export default TopBar;






