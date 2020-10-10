import React from 'react';
import typeColors from '../../helpers/typeColors'
import './Card.css';

function Card({ pokemon }) {
    const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`; 
    return (
        <div className="root__card">
        
        <div className="Card" style= {{ background: typeColors[pokemon.types[0].type.name] }}  >
                <div className="card__info">
                    <div className="poke__name">
                    {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
                    </div>
                    <p className="poke__type">
                    {
                        pokemon.types.map(type => {
                            return (
                                <div className="Card__type" >
                                    {type.type.name[0].toUpperCase() + type.type.name.slice(1)}
                                </div>
                            )
                        })
                    }
                    </p>
                </div> 
                <div className="imagess">
                <img  className="images" src={require('../../helpers/bglogo.png')} alt=""  />
                <img  className="image" src={fullImageUrl} alt=""  />
                </div>
            </div>
        </div>
     
    );
}

export default Card;