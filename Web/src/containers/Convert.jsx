import React, { Component } from "react";
import './Table.css';
import Select from 'react-select';

export default class Search extends Component {
    state = {
        fromSelectedOption: null,
        toSelectedOption: null
    };

    handleFromChange = selectedOption => {
        this.setState({ fromSelectedOption: selectedOption });
    };

    handleToChange = selectedOption => {
        this.setState({ toSelectedOption: selectedOption });
    };

    render() {
        const options = [
            {value: 'spotify', label: 'Spotify'},
            {value: 'youtube', label: 'Youtube'}
        ];

        return (
            <div>
                <center>
                    <label>From</label>
                    <Select 
                        value={this.state.selectedOption}
                        onChange={this.handleFromChange}
                        options={options}
                        className='select'
                    />
                    <br/><br/>
                    <input type='text' className='input' placeholder="Playlist ID"></input>
                    <br/><br/>
                    <label>To</label>
                    <Select 
                        value={this.state.selectedOption}
                        onChange={this.handleToChange}
                        options={options}
                        className='select'
                    />
                    <br/><br/>
                    <button type="submit" className='button'>Convert</button>
                </center>
            </div>
        )

    }
}