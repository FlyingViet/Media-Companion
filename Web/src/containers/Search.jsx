import React, { Component } from "react";
import _ from 'lodash';
import './Table.css';
import Swal from 'sweetalert2';
import {getSpotifySong, getSongsDb, insertSong} from './Common';

export default class Search extends Component {
    state = {
        searchValue: '',
        jsonData: []
    };

    handleOnChange = event => {
        this.setState({searchValue: event.target.value});
    }

    handleSearch = async () => {
        if(_.isEmpty(this.state.searchValue))
        {
            this.setState({jsonData: []});
            Swal.fire({
                title: 'Cannot Search',
                text: 'Please enter a song name',
                confirmButtonText: 'OK'
            });
            return;
        }

        //await this.makeApiCall(this.state.searchValue);
        var res = await getSpotifySong(this.state.searchValue);
        if(!_.isEmpty(res))
            this.setState({jsonData: res});
        console.log(this.state.jsonData);
        var item = await this.updateDb();
        console.log(item);
    }

    updateDb = async () => {
        var res = await getSongsDb();
        _.map(this.state.jsonData, async item => {
            var format = {SongName: item.song, SongArtist: item.artist, SpotifyID: item.id, SpotifyUrl: item.url, uri: item.uri};
            if(!_.some(res, format)){
                console.log("does not exist");
                var valid = await insertSong(item.song, item.artist, item.id, item.url, item.uri);
                console.log(valid);
            }else{
                console.log("exists");
            }
        });
        return res;
    }

    onKeyPress = (e) => {
        if(e.which === 13) {
            this.handleSearch();
        }
    }
    render() {
        return (
            <div>
                <center>
                    <h1>Search for your song</h1>
                    <input name="text" type="text" placeholder="Search" onChange={e => this.handleOnChange(e)} onKeyPress={this.onKeyPress} />
                    <button type="submit" onClick={this.handleSearch}>Search</button>
                </center>
                {!_.isEmpty(this.state.jsonData) ? (
                    <div className="container">
                        <center>
                            <table>
                                <thead>
                                    <tr>
                                        <td><h3>Song</h3></td>
                                        <td><h3>Artist</h3></td>
                                        <td><h3>Link to Spotify</h3></td>
                                    </tr>
                                    {_.map(this.state.jsonData,(json, index) => (
                                    <tr key={index}>
                                        <td>{json.song}</td>
                                        <td>{json.artist}</td>
                                        <td><a href={json.url} target="webapp-tab" rel="noopener norefferer">Play on Spotify</a></td>
                                    </tr>
                                    ))}
                                </thead>
                            </table>
                        </center>
                    </div>

                ) : (
                    <center>
                        <p>Try searching for a different song</p>
                    </center>
                )}
            </div>
        )
    }
}
