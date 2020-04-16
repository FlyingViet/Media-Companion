import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
import Swal from 'sweetalert2';
var _ = require('lodash');

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function onLogin(){
    fetch('/api/', {
      method: 'GET',
    }).then((res) => {
      return res.json();
    }).then((json) => {
      var user = _.find(json, {email: email, password: password});
      if(!_.isUndefined(user) && !_.isNull(user)){
        Swal.fire({
          title: 'Logged In',
          text: 'Successfully got response',
          confirmButtonText: 'OK'
        });
      }else{
        Swal.fire({
          title: 'Unable to log in',
          text: 'Username/Password is incorrect',
          confirmButtonText: 'OK'
        })
      }
    }).catch((error) => {
      console.log(error);
    })

  }
  
  function onRegister() {
    var userInfo = {email: email, password: password};
    fetch('/api/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "email": userInfo.email,
        "password": userInfo.password
      })
    }).then((res) => {
      if(res.status === 200){
        Swal.fire({
          title: 'Registered',
          text: 'Successfully Registered',
          confirmButtonText: 'OK'
        });
      }else if(res.status === 500){
        Swal.fire({
          title: 'Registration Failed',
          text: 'Email is already in use',
          confirmButtonText: 'OK'
        });
      }

    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
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
        <Button block bsSize="large" disabled={!validateForm()} type="login" onClick={onLogin}>
          Login
        </Button>
        <Button block bsSize="large" disabled={!validateForm()} type="register" onClick={onRegister}>
          Register
        </Button>
      </form>
    </div>
  );
}
