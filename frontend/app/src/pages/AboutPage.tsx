import React from 'react';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';


const AboutPage = () => {

  return (
    <Container>
      <Row className="mt-2">
        <Col>
          <Jumbotron>
            <h1>About</h1>
            <p>This website is a currently a prototype</p>
          </Jumbotron>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutPage;
