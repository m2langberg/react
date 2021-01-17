import React from 'react';


//import Breadcrumb from 'react-bootstrap/Breadcrumb';
//import Button from 'react-bootstrap/Button';
//import ButtonGroup from 'react-bootstrap/ButtonGroup';
//import CardColumns from 'react-bootstrap/CardColumns';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
//import Form from 'react-bootstrap/Form';
//import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
//import Table from 'react-bootstrap/Table';
//import ToggleButton from 'react-bootstrap/ToggleButton';
//import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';


import { User } from '../models/users';


import { userService } from '../services/user.service';


import "react-datepicker/dist/react-datepicker.css";

interface CenterProps {
  working: boolean
}

interface CenterState {
  modalShow: boolean
}

class Center extends React.Component<CenterProps, CenterState> {

  state: Readonly<CenterState> = {
    modalShow: false,
  }
  user: Readonly<User | null> = userService.getUser();


  render() {

    return (
      <Col sm="8" xs={{ order: 1 }}>

        <Row>
          <Col>
            <h1>Home</h1>
          </Col>

        </Row>


        <Row>
          <Col>
            this is the home page
          </Col>
        </Row>

      </Col>
    );
  }
}


interface HomePageProps {

}

interface HomePageState {
  working: boolean
  infoText: string
  errorText: string
}

class HomePage extends React.Component<HomePageProps, HomePageState> {

  state: Readonly<HomePageState> = {
    working: false,
    infoText: 'Info',
    errorText: '',
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }



  render() {
    return (
      <Container fluid>
        <Row className="flex-xl-nowrap">
          <Col className="d-flex flex-column side-bar position-sticky" sm="2">
            <Container>
              <Row>
                <Col><h4>{this.state.infoText}</h4></Col>
              </Row>
              <Row>
                <Col><h4 className="text-danger">{this.state.errorText}</h4></Col>
              </Row>
            </Container>
          </Col>
          <Col className="d-none d-xl-block side-bar position-sticky" sm="2" xs={{ order: 2 }}>
            <Container>
              <Row>
                <Col><h4>Left Side</h4></Col>
              </Row>
            </Container>
          </Col>
          <Center
            working={this.state.working}
          />
        </Row>
        <Navbar fixed="bottom">
          <Navbar.Text>
            {this.state.working &&
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            }
          </Navbar.Text>
        </Navbar>
      </Container>
    );
  }
}

export default HomePage;
