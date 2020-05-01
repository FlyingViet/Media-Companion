import React, { Component } from "react";
import "./Login.css";


export default class Search extends Component {
    render() {
        return(
            <center className="form-group">
                
                <div className="card">
                        <div className="card-block">
                            <form className="k-form">
                                <h2>Media Companion</h2>
                                <label className="k-form-field">
                                    <input className="k-textbox" placeholder="Enter Email" onChange={e => this.props.changeEmail(e)}/>
                                </label>
                                <br/>
                                <label className="k-form-field">
                                    <input className="k-textbox" placeholder="Enter Password" onChange={e => this.props.changePassword(e)} />
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
