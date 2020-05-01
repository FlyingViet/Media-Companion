import React, { Component } from "react";
import _ from 'lodash';
import Swal from 'sweetalert2';
import LoginComponent from './LoginComponent';
import "./Login.css";
import UserPage from './UserPage';


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
      if(_.isEmpty(this.state.email) || _.isEmpty(this.state.password)){
        Swal.fire({
          title: `Email or Password is empty`,
          text: 'Please try again',
          confirmButtonText: 'OK'
        });
      }
      this.makeRegisterCall();
    }

    makeLoginCall = () => {
        fetch('/api/', {
            method: 'GET',
          }).then((res) => {
            return res.json();
          }).then((json) => {
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
            <div className='Login'>
                {(this.state.loggedIn) ? 
                <UserPage
                  user={this.state.user}
                /> : 
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
