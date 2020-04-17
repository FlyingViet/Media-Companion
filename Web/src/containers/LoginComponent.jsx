import React, { Component } from "react";

export default class Search extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return(
            <center>
                <h1>Media Companion</h1>
                <label>Email</label>
                <input name="email" type="email" placeholder="Search" onChange={e => this.props.changeEmail(e)} />
                <br/> 
                <label>Password</label>
                <input name="password" type="password" placeholder="Search" onChange={e => this.props.changePassword(e)} />
                <br/>               
                <button onClick={this.props.handleLogin}>Login</button>
                <button onClick={this.props.handleRegister}>Register</button>
            </center>
        )
    }
}