import React, { Component } from 'react';
import Axios from 'axios';
import Japokename from '../../helpers/jaPokeNames';
import typecolor from '../../helpers/typeColors';
import  './Pokedetails.css';
export default class Pokedetails extends Component {
    state = {
        name: '',
        japokename: '',
        pokemonId: '',
        imageUrl: '',
        types: [],
        description: '',
        statTitleWidth: 3,
        statBarWidth: 9,
        stats: {
          hp: '',
          attack: '',
          defense: '',
          speed: '',
          specialAttack: '',
          specialDefense: ''
        },
        height: '',
        weight: '',
        eggGroups: '',
        catchRate: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: '',
        themeColor: '#EF5350'
      };

        async componentDidMount() {
           
              
            const { pokemonId } = this.props.match.params;

            const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
            const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
            const pokemonRes = await Axios.get(pokemonUrl);

            const fname = pokemonRes.data.name[0].toUpperCase(); 
            const lname = pokemonRes.data.name.slice(1);
            const name = fname + lname;
            const imageUrl = `https://pokeres.bastionbot.org/images/pokemon/${pokemonId}.png`;

            let { hp, attack, defense, speed, specialAttack, specialDefense } = '';
            const japokename = Japokename[pokemonRes.data.name]
            pokemonRes.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                hp = stat['base_stat'];
                break;
                case 'attack':
                attack = stat['base_stat'];
                break;
                case 'defense':
                defense = stat['base_stat'];
                break;
                case 'speed':
                speed = stat['base_stat'];
                break;
                case 'special-attack':
                specialAttack = stat['base_stat'];
                break;
                case 'special-defense':
                specialDefense = stat['base_stat'];
                break;
                default:
                break;
            }
            });

            // Convert Decimeters to Feet... The + 0.0001 * 100 ) / 100 is for rounding to two decimal places :)
            const height =
            Math.round((pokemonRes.data.height * 0.328084 + 0.00001) * 100) / 100;

            const weight =
            Math.round((pokemonRes.data.weight * 0.220462 + 0.00001) * 100) / 100;

            const types = pokemonRes.data.types.map(type => type.type.name);

            //const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;

            const abilities = pokemonRes.data.abilities
            .map(ability => {
                return ability.ability.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
            })
            .join(', ');

            const evs = pokemonRes.data.stats
            .filter(stat => {
                if (stat.effort > 0) {
                return true;
                }
                return false;
            })
            .map(stat => {
                return `${stat.effort} ${stat.stat.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}`;
            })
            .join(', ');

            // Get Pokemon Description .... Is from a different end point uggh
            await Axios.get(pokemonSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some(flavor => {
                if (flavor.language.name === 'en') {
                description = flavor.flavor_text;
                return;
                }
            });
            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 - femaleRate);

            const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

            const eggGroups = res.data['egg_groups']
                .map(group => {
                return group.name
                    .toLowerCase()
                    .split(' ')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
                })
                .join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

            this.setState({
                description,
                genderRatioFemale,
                genderRatioMale,
                catchRate,
                eggGroups,
                hatchSteps
            });
            });

            this.setState({
            imageUrl,
            pokemonId,
            name,
            japokename,
            types,
            stats: {
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs
            });
}


    render() {
        const {  history } = this.props;
        return (
            <div>
                <div className="backgrond" style= {{ backgroundColor: typecolor[this.state.types[0]] }}>    
                    <div className="headr">
                        <div className="left__header">
                            <div className="poke__id">{ "#" + this.state.pokemonId.toString().padStart(3,'0')}</div>
                            <div className="name__poke">{this.state.name}</div>
                        </div>
                        <img className="pokedex__logo" src="http://pngimg.com/uploads/pokemon_logo/pokemon_logo_PNG9.png" alt="Pokedex"></img>
                    </div>
                    <div className="pokedtail__body">
                        <div className="japoke__name">{ this.state.japokename }</div>
                        <div className="mesurments">
                            <div className="height"><span className="bold">Height - </span>{ this.state.height+`"` }</div>
                            <div className="weight"><span className="bold">Weight - </span>{ this.state.weight+"lb" }</div>
                        </div>
                        <div className="about__poke">
                        {
                            this.state.types.map(type => {
                                return (
                                    <span className="pokedet__type" style={{ color: typecolor[this.state.types[0]] }}>
                                        {type[0].toUpperCase() + type.slice(1)}
                                    </span>
                                )
                            })
                        }
                        </div>
                        <div className="poke__desc">Bio<br/>{ this.state.description }</div>
                        <img className="poke__img" src={this.state.imageUrl} alt={this.state.name} />
                    </div>
                        <div className="bottom__details">
                            <div className="stats__details">
                                <div className="Stats__bars">
                                    <span className="Stats_name" style={{width:100}}>HP</span>
                                    <div class="progress" >
                                        <div class="bar" style={{width: this.state.stats.hp}}>
                                            <p class="percent">{this.state.stats.hp}</p>
                                        </div>
                                    </div>
                                    </div>
                                <div className="Stats__bars">
                                    <span className="Stats_name" style={{width:100}}>Attack</span>
                                    <div class="progress">
                                        <div class="bar" style={{width: this.state.stats.attack}}>
                                            <p class="percent">{this.state.stats.attack}</p>
                                        </div>
                                    </div>
                                    </div>
                                <div className="Stats__bars">
                                    <span className="Stats_name" style={{width:100}}>Defense</span>
                                    <div class="progress">
                                        <div class="bar" style={{width: this.state.stats.defense}}>
                                            <p class="percent">{this.state.stats.defense}</p>
                                        </div>
                                    </div>
                                    </div>
                                <div className="Stats__bars">
                                    <span className="Stats_name" style={{width:100}}>Speed</span>
                                    <div class="progress" >
                                        <div class="bar" style={{width: this.state.stats.speed}}>
                                            <p class="percent">{this.state.stats.speed}</p>
                                        </div>
                                    </div>
                                    </div>
                                <div className="Stats__bars">
                                    <span className="Stats_name" style={{width:100}}>Sp Atk</span>
                                    <div class="progress" >
                                        <div class="bar" style={{width: this.state.stats.specialAttack}}>
                                            <p class="percent">{this.state.stats.specialAttack}</p>
                                        </div>
                                    </div>
                                    </div>
                                <div className="Stats__bars">
                                <span className="Stats_name" style={{width:100}}>Sp Def</span>
                                <div class="progress">
                                    <div class="bar" style={{width: this.state.stats.specialDefense}}>
                                        <p class="percent">{this.state.stats.specialDefense}</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="profiles">
                                <div className="profile__details">
                                    <div className="profile__name">Catch Rate </div>
                                    <div className="profile__value">{this.state.catchRate + "%"}</div>
                                </div>
                                <div className="profile__details">
                                    <div className="profile__name" >Gender Ratio </div>
                                        <div className="profile__value">
                                            <div class="gen__progress" style={{width:200,display:"flex"}}>
                                            <div class="gen__bar" style={{width: this.state.genderRatioMale*2,backgroundColor:"#4E5DFF"}}><p class="percent">{this.state.genderRatioMale}</p></div>
                                                <div class="gen__bar" style={{width: this.state.genderRatioFemale*2,backgroundColor:"#EF5D9D"}}><p class="percent">{this.state.genderRatioFemale}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="profile__details">
                                        <div className="profile__name">Egg Group </div>
                                        <div className="profile__value">{this.state.eggGroups }</div>
                                    </div>
                                    <div className="profile__details">
                                        <div className="profile__name">Hatch Steps </div>
                                        <div className="profile__value">{this.state.hatchSteps }</div>
                                    </div>
                                    <div className="profile__details">
                                        <div className="profile__name">Abilities </div>
                                        <div className="profile__value">{this.state.abilities }</div>
                                    </div>
                                    <div className="profile__details">
                                        <div className="profile__name">EVs </div>
                                        <div className="profile__value">{this.state.evs }</div>
                                    </div>
                                </div>
                        </div>  
                        <div className="back__btn" onClick={() => history.push("/")} style={{ color: typecolor[this.state.types[0]] }} > POKELIST</div> 
                </div> 
            </div>
        )
    }
}
