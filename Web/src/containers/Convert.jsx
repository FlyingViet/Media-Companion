import React, { Component } from "react";
import './Table.css';
import Select from 'react-select';
import _ from 'lodash';
import Swal from 'sweetalert2';

export default class Search extends Component {
    state = {
        fromSelectedOption: null,
        toSelectedOption: null,
        options: [
            {value: 'spotify', label: 'Spotify'},
            {value: 'youtube', label: 'Youtube'}
        ],
        toOptions: [],
        searchId: null,
        fromJsonData: [],
        toJsonData: [],
        searchResults: []
    };

    handleOnChange = event => {
        this.setState({searchId: event.target.value});
    }

    handleFromChange = selectedOption => {
        var newOptions = _.filter(this.state.options, (item) => {
            return item !== selectedOption;
        })
        this.setState({ fromSelectedOption: selectedOption, toOptions: newOptions});
    };

    handleToChange = selectedOption => {
        this.setState({ toSelectedOption: selectedOption });
    };

    handleConvert = async() => {
        if(_.isEmpty(this.state.searchId) || _.isEmpty(this.state.fromSelectedOption) || _.isEmpty(this.state.toSelectedOption)){
            this.setState({fromJsonData: []});
            Swal.fire({
                title: 'Cannot Convert',
                text: 'Please enter a playlist ID/Select Convert Options',
                confirmButtonText: 'OK'
              });
              return;
        }
        var searchInput = this.state.fromSelectedOption.value;
        switch(searchInput){
            case 'spotify':
                await this.getSpotifyPlaylist(this.state.searchId);
                break;
            case 'youtube':
                //toCode
                break;
            default:
                console.log("Error, cannot get search from option");
        }
        console.log(this.state.fromJsonData);
        var convertOutput = this.state.toSelectedOption.value;
        switch(convertOutput){
            case 'spotify':
                this.convertToSpotifyPlaylist();
                break;
            case 'youtube':
                //toCode
                break;
            default:
                console.log("Error, cannot get search from option");
        }
        console.log(this.state.toJsonData);
    }

    getSpotifyPlaylist = async() => {
        await fetch('/api/Spotify/playlist/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "search_text": this.state.searchId
            })
        }).then((res) => {
            return res.json();
        }).then((json) => {
            var res = [];
            for(var i in json)
                res.push(json[i]);
            this.setState({fromJsonData: res});
        });

        return Promise.resolve(1);
    };

    searchSpotify = async searchInput => {
        await fetch('/api/Spotify/search/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "search_text": searchInput
            })
        }).then((res) => {
            return res.json();
        }).then((json) => {
            var res = [];
            for(var i in json)
                res.push(json[i]);
            this.setState({searchResults: res});
        });
        return Promise.resolve(1);
    };

    convertToSpotifyPlaylist = () => {
        var fromList = this.state.fromJsonData;
        var outList = [];
        _.map(fromList, async (s) => {
            var search = `${s.song} - ${s.artist}`;
            await this.searchSpotify(search);
            if(!_.isEmpty(this.state.searchResults)){
                outList.push(this.state.searchResults[0]);
            }
        });
        this.setState({toJsonData: outList});
    }

    render() {

        return (
            <div>
                <center>
                    <label>From</label>
                    <Select 
                        value={this.state.fromSelectedOption}
                        onChange={this.handleFromChange}
                        options={this.state.options}
                        className='select'
                    />
                    <br/><br/>
                    <input type='text' className='input' placeholder="Playlist ID" onChange={e => this.handleOnChange(e)}></input>
                    <br/><br/>
                    <label>To</label>
                    <Select 
                        value={this.state.toSelectedOption}
                        onChange={this.handleToChange}
                        options={this.state.toOptions}
                        className='select'
                    />
                    <br/><br/>
                    <button type="submit" className='button' onClick={this.handleConvert}>Convert</button>
                </center>
            </div>
        )

    }
}