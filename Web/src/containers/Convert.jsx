import React, { Component } from "react";
import './Table.css';
import Select from 'react-select';
import _ from 'lodash';
import Swal from 'sweetalert2';
import {getSpotifyPlaylist, getSpotifySong, getSongsDb, ytCreate, ytInsert, ytAuth} from './Common';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        searchResults: [],
        playlistId: '',
        userId: 0
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
        var userId = this.props.userId;
        this.setState({userId: userId});
        var searchInput = this.state.fromSelectedOption.value;
        var result = [];
        switch(searchInput){
            case 'spotify':
                result = await getSpotifyPlaylist(this.state.searchId);
                await delay(5000);
                break;
            case 'youtube':
                //toCode
                break;
            default:
                console.log("Error, cannot get search from option");
        }
        if(!_.isEmpty(result))
            var playlistId = result[0].name;
            result = result.splice(1);
            this.setState({fromJsonData: result, playlistId: playlistId});
        console.log(this.state.fromJsonData);
        await this.convertPlaylist();
        console.log(this.state.toJsonData);
    }

    createYtPlaylist = async (playlistName, userId) => {
        var item = ytCreate(playlistName, userId);
        return item;
    }

    insertYtSong = async (playlistId, songName, userId) => {
        var item = ytInsert(playlistId, songName, userId);
        return item;
    }

    convertPlaylist = async () => {
        var fromList = this.state.fromJsonData;
        var outList = [];
        var convertOutput = this.state.toSelectedOption.value;
        //var dbSongs = await getSongsDb();
        var playlistId = '';
        switch(convertOutput){
            case 'spotify':
                break;
            case 'youtube':
                playlistId = await this.createYtPlaylist(this.state.playlistId, this.state.userId);       
                break;
            default:
                console.log("Error, cannot get search from option");
        }
        _.map(fromList, async (s) => {
            //var format = {SongName: s.song, SongArtist: s.artist};
            // if(_.some(dbSongs, format)){
            //     var item = _.filter(dbSongs, format)[0];
            //     var transform = {song: item.SongName, artist: item.SongArtist, url: item.SpotifyUrl, id: item.SpotifyID}
            //     outList.push(transform);
            // }else{
            //     var search = `${s.song} - ${s.artist}`;
            //     /* TODO: Create and Insert a new Playlist */
            //     var result = [];
            //     switch(convertOutput){
            //         case 'spotify':
            //             break;
            //         case 'youtube':
            //             //toCode
            //             result = await this.createYtPlaylist(this.state.playlistId);
            //             var songTitle = await this.insertYtSong(this.state.playlistId, search);
            //             break;
            //         default:
            //             console.log("Error, cannot get search from option");
            //     }
            //     this.setState({searchResults: result});
            //     if(!_.isEmpty(this.state.searchResults)){
            //         outList.push(this.state.searchResults[0]);
            //     }
            // }
            var search = `${s.song} - ${s.artist}`;
                switch(convertOutput){
                    case 'spotify':
                        break;
                    case 'youtube':
                        console.log(playlistId);
                        var songTitle = await this.insertYtSong(playlistId, search, this.state.userId);
                        //await this.insertYtSong("testId", search, this.state.userId);
                        console.log(songTitle);
                        break;
                    default:
                        console.log("Error, cannot get search from option");
                }
        });
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