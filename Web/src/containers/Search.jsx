import React, { Component } from "react";
import _ from 'lodash';

class Search extends Component {
    state = {
        searchValue: '',
        meals: [],
        jsonData: []
    };

    handleOnChange = event => {
        this.setState({searchValue: event.target.value});
    }

    handleSearch = () => {
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
            console.log(json);
            var res = [];
            for(var i in json)
                res.push(json[i]);
            this.setState({jsonData: res});
            console.log(res);
        });
    };

    render() {
        return (
            <div>
                <h1>Search for your song</h1>
                <input name="text" type="text" placeholder="Search" onChange={e => this.handleOnChange(e)} />
                <button onClick={this.handleSearch}>Search</button>
                {this.state.jsonData ? (
                    <center>
                        <table>
                        <tr>
                            <td><h3>Song</h3></td>
                            <td><h3>Artist</h3></td>
                            <td><h3>Link to Spotify</h3></td>
                        </tr>
                        {_.map(this.state.jsonData,(json, index) => (
                            <tr>
                                <td>{json.song}</td>
                                <td>{json.artist}</td>
                                <td><a href={json.url} target="_blank">Play on Spotify</a></td>
                            </tr>
                        ))}
                    </table>
                    </center>
                ) : (
                    <p>Try searching for a different song</p>
                )}
            </div>
        )
    }
}
export default Search;