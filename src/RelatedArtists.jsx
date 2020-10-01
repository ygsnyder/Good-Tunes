import React, { Component } from 'react';
import './App.css';

class RelatedArtists extends Component {
    render(){
        const { artists } = this.props;
        return(
            <div className='relatedartists'>
                <div className='relatedartists-header'> You May Like These Artists Too</div>
                {
                    artists.map((artist, index) => {
                        return (
                            <div className='relatedartists-artist' 
                                key={index}
                                onClick={ () => {
                                        this.props.setQuery(artist.name);
                                        this.props.search();
                                    }
                                }
                            >
                                <img 
                                    className='relatedartists-artist-img'
                                    alt='artists you may like'
                                    src={artist.images[2].url}
                                />
                                <div className='relatedartists-artist-name'>
                                    {artist.name}
                                </div>
                            </div>
                        ) 
                    })
                }
            </div>
            
        )
    }
}

export default RelatedArtists;