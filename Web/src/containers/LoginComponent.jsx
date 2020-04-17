import React, { Component } from "react";
import "./Login.css";

export default class Search extends Component {
    render() {
        return(
            <center className="Login">
                <h1>Media Companion</h1>
                <br/> 
                <label>Email</label>
                <input name="email" type="email" placeholder="Enter email" onChange={e => this.props.changeEmail(e)} />
                <br/> 
                <label>Password</label>
                <input name="password" type="password" placeholder="Enter password" onChange={e => this.props.changePassword(e)} />
                <br/>               
                <button onClick={this.props.handleLogin}>Login</button>
                <button onClick={this.props.handleRegister}>Register</button>
            </center>
        )
    }
}