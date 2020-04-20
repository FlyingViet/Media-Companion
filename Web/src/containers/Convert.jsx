import React, { Component } from "react";
import './Table.css';
import Select from 'react-select';
import _ from 'lodash';
import Swal from 'sweetalert2';
import {getSpotifyPlaylist, getSpotifySong, getSongsDb} from './Common';

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
        var result = [];
        switch(searchInput){
            case 'spotify':
                result = await getSpotifyPlaylist(this.state.searchId);
                break;
            case 'youtube':
                result = await getSpotifyPlaylist(this.state.searchId);
                //toCode
                break;
            default:
                console.log("Error, cannot get search from option");
        }
        if(!_.isEmpty(result))
            this.setState({fromJsonData: result});
        console.log(this.state.fromJsonData);
        await this.convertPlaylist();
        console.log(this.state.toJsonData);
    }

    convertPlaylist = async () => {
        var fromList = this.state.fromJsonData;
        var outList = [];
        var convertOutput = this.state.toSelectedOption.value;
        var dbSongs = await getSongsDb();
        _.map(fromList, async (s) => {
            var format = {SongName: s.song, SongArtist: s.artist};
            if(_.some(dbSongs, format)){
                var item = _.filter(dbSongs, format)[0];
                var transform = {song: item.SongName, artist: item.SongArtist, url: item.SpotifyUrl, id: item.SpotifyID}
                outList.push(transform);
            }else{
                var search = `${s.song} - ${s.artist}`;
                /* TODO: Create and Insert a new Playlist */
                var result = [];
                switch(convertOutput){
                    case 'spotify':
                        result = await getSpotifySong(search);
                        break;
                    case 'youtube':
                        //toCode
                        result = await getSpotifySong(search);
                        break;
                    default:
                        console.log("Error, cannot get search from option");
                }
                this.setState({searchResults: result});
                if(!_.isEmpty(this.state.searchResults)){
                    outList.push(this.state.searchResults[0]);
                }
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