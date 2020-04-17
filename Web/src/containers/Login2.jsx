import React, { Component } from "react";
import _ from 'lodash';
import Swal from 'sweetalert2';
import Search from './Search';
import LoginComponent from './LoginComponent';
import Modal from 'react-modal';
import "./Login.css";

export default class Login2 extends Component {
    state = {
        email: '',
        password: '',
        user: {},
        loggedIn: false
    };
    changeEmail = event => {
        this.setState({email: event.target.value});
    }
    changePassword = event => {
        this.setState({password: event.target.value});
    }

    handleLogin = () => {
        this.makeLoginCall();
    }

    handleRegister = () => {
        this.makeRegisterCall();
    }

    makeLoginCall = () => {
        fetch('/api/', {
            method: 'GET',
          }).then((res) => {
            return res.json();
          }).then((json) => {
              console.log(json);
            var user = _.find(json, {email: this.state.email, password: this.state.password});
            if(!_.isUndefined(user) && !_.isNull(user)){
              Swal.fire({
                title: `Welcome ${user.email}`,
                text: 'Successfully Logged In',
                confirmButtonText: 'OK'
              });
              this.setState({user: user, loggedIn: true});
              this.forceUpdate();
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

    makeRegisterCall = () => {
        var userInfo = {email: this.state.email, password: this.state.password};
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

    render() {
        return (
            <div>
                {(this.state.loggedIn) ? 
                <Modal
                  isOpen={true}
                >
                  <Search/>
                </Modal> : 
                <LoginComponent 
                    changeEmail={this.changeEmail}
                    changePassword={this.changePassword}
                    handleLogin={this.handleLogin}
                    handleRegister={this.handleRegister}
                    />}
                
            </div>
        )
    }
}
