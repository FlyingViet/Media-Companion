import React, { Component } from "react";
import _ from 'lodash';
import './Table.css';
import Swal from 'sweetalert2';

export default class Search extends Component {
    state = {
        searchValue: '',
        jsonData: []
    };

    handleOnChange = event => {
        this.setState({searchValue: event.target.value});
    }

    handleSearch = () => {
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

        this.makeApiCall(this.state.searchValue);
    }

    makeApiCall = searchInput => {
        fetch('/api/Spotify/search/', {
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
            this.setState({jsonData: res});
        });
    };

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
