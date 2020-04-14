import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function onRegister() {
    var userInfo = {email: email, password: password};
    fetch('http://127.0.0.1:5000/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "email": userInfo.email,
        "password": userInfo.password
      })
    }).then((res) => {
      return res.json()
    }).then((json) => {
      console.log(json);
    });
  }
  return (
    <div className="Login">
      <form onSubmit={handleSubmit} onRegister={onRegister}>
        <FormGroup controlId="email" bsSize="large">
          <h1>Media Companion</h1>
          <FormLabel>Email                                                    </FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
        <Button block bsSize="large" disabled={!validateForm()} type="register" onClick={onRegister}>
          Register
        </Button>
      </form>
    </div>
  );
}
