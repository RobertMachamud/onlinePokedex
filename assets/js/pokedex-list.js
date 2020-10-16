// DOM Elements
const pDexListContainer = document.querySelector(".pdl-cont");
const typeButtonContainer = document.querySelector(".poke-type-btn-cont");


// List with all pkmn
const allPokemon = [];


// All types colors
const allColors = {
    fire: '#FB6C6C',
    grass: '#48D0B0',
    electric: '#FFD86F',
    water: '#76BDFE',
    ground: '#D68E5E',
    rock: '#C9B98B',
    fairy: '#FEBAEA',
    poison: '#54B564',
//            poison: '#40244A',
//            poison: '#98d7a5',
    bug: '#2CDAB1',
    dragon: '#0875C8',
//            dragon: '#97b3e6',
    psychic: '#9758AD',
//            psychic: '#F366B9',
    flying: '#AEC5EF',
    fighting: '#DA475C',
//            fighting: '#C27E6E',
//            fighting: '#D56723',
    normal: '#5B5F68',
    ice: '#51C4E7',
    ghost: '#7B62A3',
    dark: '#707070',
    steel: '#9EB7B8'
}


// Creates all filter types buttons
const createTypeFilterButtons = (types) => {
    Object.keys(types).forEach(type => {
        typeButtonContainer.insertAdjacentHTML("beforeend", `
            <button class="poke-type-filter-btn bttn" style="background-color: ${Object.values(types)[Object.keys(types).indexOf(type)]}" onclick="filterPokemonType(event)">${capitalize(type)}</button>
        `);
    });
} 


// Gets all pokemon via API
const getAllPokemon = () => { 
    for (let i = 1; i <= 150; i++) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()).then(data => {
            // formats every pokemon
            const formattetPokemon = {
                id : data.id,
                name : capitalize(data.name),
                weight: data.weight,
                height: data.height,                                      
                type1: capitalize(data.types[0].type.name),                          // [0].type.name  
                type2: checkForSecondType(data.types),
                abilities: data.abilities,                  // [0].ability.name
                stats: [
                    { hpStat : [data.stats[0].stat.name, data.stats[0].base_stat ] },
                    { attStat : [data.stats[1].stat.name, data.stats[1].base_stat ] },
                    { defStat : [data.stats[2].stat.name, data.stats[2].base_stat ] },
                    { spAttStat : [data.stats[3].stat.name, data.stats[3].base_stat ] },
                    { spDefStat : [data.stats[4].stat.name, data.stats[4].base_stat ] },
                    { speedStat : [data.stats[5].stat.name, data.stats[5].base_stat ] },
                ]
            }
            // adds color
            formattetPokemon.color = Object.values(allColors)[Object.keys(allColors).indexOf((formattetPokemon.type1).toLowerCase())];
            
            // fetching species api
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}/`).then(res => res.json()).then(data => {
                formattetPokemon.text = data.flavor_text_entries[1].flavor_text;
                
                // fetching api for images
                fetch(`https://pokeres.bastionbot.org/images/pokemon/${i}.png`).then(image => {
                    formattetPokemon.sprite = image.url;
                    allPokemon.push(formattetPokemon);
                    
                }).catch(err => console.error(err));
                            
            }).catch(err => console.error(err));

        }).catch(err => console.error(err));
    }
    checkIfLoaded();
}


// Capitalizes a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


// Checks if pokemon has a second type
const checkForSecondType = (types) => {
    if (types.length > 1) {
        return capitalize(types[1].type.name);
    } else {
        return "hidden";
    }
}


// Checks every 50ms if All 150 pokemon are loaded - recursive
const checkIfLoaded = () => allPokemon.length === 150 ? displayAllPokemon(allPokemon) : setTimeout(checkIfLoaded, 50);



// Displays all pokemon cards to screen
const displayAllPokemon = (pokeList) => {
    // sorts pokemon list with pokeomn id
    allPokemon.sort((a, b) => a.id - b.id);
    createTypeFilterButtons(allColors);
    fillPokemon(allPokemon);
}


// Fills container with pokemon cards
const fillPokemon = (pokeList) => {
    pokeList.forEach(pokemon => {
        pDexListContainer.insertAdjacentHTML("beforeend", `
            <div class="poke-card-wide" style="background-color: ${pokemon.color}">
            <div class="poke-card-wide-left flex-column">
                <h3 class="poke-card-wide-headline">${pokemon.name}</h3>
                <div class="poke-card-wide-type flex-center">${pokemon.type1}</div>
                <div class="poke-card-wide-type flex-center ${pokemon.type2}">${pokemon.type2}</div>
            </div>
            <div class="poke-card-wide-right">
                <div class="poke-card-wide-img flex-center">
                    <div class="poke-circle flex-center" style="background-color:${pokemon.color}">
                        <div class="poke-inner-circle"></div>
                        </div>
                    <img src="${pokemon.sprite}" alt="${pokemon.name}-image">
                </div>
            </div>
        </div>`); 
    });
}


// Fills Pokedex
getAllPokemon();



const filterPokemonType = (e) => {
    pDexListContainer.innerHTML = "";
    fillPokemon(allPokemon.filter(pokemon => pokemon.type1 == e.target.innerHTML || pokemon.type2 == e.target.innerHTML));
}
