import React, { Component } from "react";
import Search from './Search';
import Modal from 'react-modal';
import Playlist from './Playlist';
import Convert from './Convert';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '60%',
      height                : '650px'
    }
  };

export default class Login2 extends Component {
    state = {
        searchOpen: false,
        convertOpen: false,
        playlistOpen: false
    };

    handleSearch = () => {
        this.setState({searchOpen: true});
    }

    handlePlaylist = () => {
        this.setState({playlistOpen: true});
    }

    handleConvert = () => {
        this.setState({convertOpen: true});
    }

    handleClose = () => {
        this.setState({searchOpen: false, convertOpen: false, playlistOpen: false});
    }

    createComponent = () => {
        if(this.state.searchOpen){
            return (
                <Modal
                    isOpen={this.state.searchOpen}
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.handleClose}
                    contentLabel="Search"
                    style={customStyles}
                    ariaHideApp={false}
                > 
                    <Search/>
                </Modal>
            )
        }else if(this.state.playlistOpen){
            return (
                <Modal
                    isOpen={this.state.playlistOpen}
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.handleClose}
                    contentLabel="Playlist"
                    style={customStyles}
                    ariaHideApp={false}
                > 
                    <Playlist/>
                </Modal>
            )
        }else if(this.state.convertOpen){
            return (
                <Modal
                    isOpen={this.state.convertOpen}
                    shouldCloseOnEsc={true}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={this.handleClose}
                    contentLabel="Convert"
                    style={customStyles}
                    ariaHideApp={false}
                > 
                    <Convert/>
                </Modal>
            )
        }
    }

    render() {
        return (
            <center>
                <h1>Welcome to Media Companion</h1>
                <br/>
                <button onClick={this.handleSearch}>Search</button>
                <button onClick={this.handlePlaylist}>Playlist</button>
                <button onClick={this.handleConvert}>Convert Playlist</button>
                {this.createComponent()}
            </center>
        )
    }
}