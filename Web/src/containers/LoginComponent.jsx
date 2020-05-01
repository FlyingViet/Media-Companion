import React, { Component } from "react";
import "./Login.css";

import { MDBInput } from "mdbreact";


export default class Search extends Component {
    render() {
        return(
            <center className="form-group">
                <h1>Media Companion</h1>
                <div className="card">
                        <div className="card-block">
                            <form className="k-form">
                                <label className="k-form-field">
                                    <input className="k-textbox" placeholder="Email" onChange={e => this.props.changeEmail(e)}/>
                                </label>
                                <br/>
                                <label className="k-form-field">
                                    <input className="k-textbox" placeholder="Password" onChange={e => this.props.changePassword(e)} />
                                </label>
                            </form>
                        </div>
                    </div>            
                <button onClick={this.props.handleLogin}>Login</button>
                <button onClick={this.props.handleRegister}>Register</button>
            </center>
        )
    }
} 
