import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
import Container from "react-bootstrap/Container";
import Home from "../pages/Home";

class App extends Component {
  render() {
    return (
      <div className="App d-flex flex-row justify-content-center w-100">
        <Container>
          <Home />
        </Container>
      </div>
    );
  }
}

export default App;
