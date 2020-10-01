import React, { Component } from 'react';
import { FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            query: '',
            artist: null,
            artists: null,
            tracks: null,
            access_token: '',
        }
    }

    setQuery(query){
        this.setState({query});
    }

    async authorize(){
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic ZDYzYWNjZjNmZWE1NDk1OWFlOGI5NWM5MzI2MjI3ZTc6NWJmMjBhNWY4OWFmNDMxOWI5MGNmM2UyZTFiZTNjNzc=");
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        //myHeaders.append("Cookie", "__Host-device_id=AQC4DZkIGUMNTzlEs5rP4pp-wA3Dx2_rNWLvYVRRnMNJDjR7LMadWD9v2yDBHBGbxPFbzRVZgkV2R4-ZeNdNKJjETWQUQO1zQv8");

        var urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "client_credentials");

        const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
        }
        
        let res = await fetch("https://accounts.spotify.com/api/token", requestOptions);
        res = await res.json();
        return res.access_token;
          
    }

    async search(){
        const access_token = await this.authorize();
        this.setState({access_token});
        const BASE_URL = 'https://api.spotify.com/v1/search';
        let FETCH_URL = `${BASE_URL}?q=${this.state.query}&type=artist&limit=1`; 
        const ALBUM_URL = 'https://api.spotify.com/v1/artists';

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${access_token}`);
        
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        }

        let res = await fetch(FETCH_URL, requestOptions);
        res = await res.json();
        console.log("ARTIST", res);
        const artist = await res.artists.items[0];
        this.setState({artist});
        

        FETCH_URL = `${ALBUM_URL}/${artist.id}/top-tracks?country=US`;
        
        res = await fetch (FETCH_URL, requestOptions);
        res = await res.json();
        console.log("TRACKS ", res);
        const { tracks } = res;
        this.setState({tracks});
        

        FETCH_URL = `https://api.spotify.com/v1/artists/${artist.id}/related-artists`;

        res = await fetch (FETCH_URL,  requestOptions);
        res = await res.json();
        const { artists } = res;
        this.setState({artists});
        console.log("ARTISTS", artists);
    }

    render(){
        return (
            <div className='App'>
                <div className='App-title'>
                <i class="fas fa-guitar"></i>
                Good Tunes
            </div>
                <FormGroup className='App-searchbox'>
                    <InputGroup>
                        <FormControl
                            type='text'
                            placeholder='Search for an Artist'
                            onChange={event => {this.setState({query: event.target.value})}}
                            onKeyPress={event => {
                                if(event.key === 'Enter' ) this.search()
                            }}
                        />
                        <InputGroup.Append onClick={()=>this.search()}>
                        <Button 
                            variant="outline-secondary"
                            className='App-searchbox-button'
                        >
                            <i class='fas fa-search App-searchbox-button-icon'></i>
                        </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </FormGroup>
                {
                    this.state.artist !== null && this.state.tracks !== null && this.state.artists !== null
                        ?   <div>
                                <Profile 
                                    artist={this.state.artist}
                                />
                                <Gallery 
                                    tracks = {this.state.tracks}
                                    artists = {this.state.artists}
                                    search = {this.search.bind(this)}
                                    setQuery = {this.setQuery.bind(this)}
                                />
                            </div>
                            
                        : <div></div>
                }
            </div>
        )
    }
}

export default App;