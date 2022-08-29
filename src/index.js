const pokeImg = document.querySelector("#pokeImg");
const pokeDesc = document.querySelector("#desc");
const pokeDmg = document.querySelector("#dmg");
const pokeDef = document.querySelector("#dfs");
const pokeSpDef = document.querySelector("#sp-def");
const pokePs = document.querySelector("#ps");
const pokeVel = document.querySelector("#vel");
const pokemonsList = document.querySelector("#pokemons");
const BASE_API = "https://pokeapi.co/api/v2";
const pokemon_API = `${BASE_API}/pokemon`;
let currentPokemon;
let sprites = [];
let currentSprite = 0;
let listPokemons = "";

const fetchData = (API) => {
    return fetch(API)
        .then((res) => res.json())
        .then((data) => (data));
    };

//fetchData(`${pokemon_API}/1`);

const writeDescription = (API, node) => {
    fetchData(API).then(specie => {
       node.textContent = specie.flavor_text_entries[0].flavor_text;
    });
};

const printPokemon = (pokemon) => {

    fetchData(`${pokemon_API}/${pokemon}`).then(data => {
        if (sprites.length > 0) {
            sprites = [];
        }
        currentPokemon = data;
        pokeName.textContent = data.name;
        pokeImg.src = data.sprites.front_default;
        pokePs.textContent = data.stats[0].base_stat;
        pokePs.style.width = `${data.stats[0].base_stat}%`;
        pokeDmg.textContent = data.stats[1].base_stat;
        pokeDmg.style.width = `${data.stats[1].base_stat}%`;
        pokeDef.textContent = data.stats[2].base_stat;
        pokeDef.style.width = `${data.stats[2].base_stat}%`;
        pokeVel.textContent = data.stats[5].base_stat;
        pokeVel.style.width = `${data.stats[5].base_stat}%`;
        pokeSpDef.textContent = data.stats[4].base_stat;
        pokeSpDef.style.width = `${data.stats[4].base_stat}%`;
        pokeDesc.textContent = data.name;
        writeDescription(data.species.url, pokeDesc)
        const pokeSprites = currentPokemon.sprites;
        for (const key in pokeSprites) {
            if (typeof pokeSprites[key] === "string") {
                sprites.push(pokeSprites[key])
            }
        }
    });
};

const printPokemons = (API) => {
    fetchData(API).then(pokemons => {
        listPokemons = pokemons;

        pokemons.results.map(pokemon => {
            const listItem = document.createElement("li")
            fetchData(pokemon.url).then(details => {
                listItem.classList.add("default");
                listItem.innerHTML = `
                <img src=${details.sprites.front_default} alt=${details.name} >
                    <div>
                        <h3>${details.name}</h3>
                        <div class="types">
                        ${details.types.map((type) => `<span>${type.type.name}</span>`)}
                        </div>
                        <p id=${details.name} ></p>
                        <button onclick=printPokemon(${details.id}) >Show Pokemon</button>
                    </div>
                `;
                const detailsPok = document.querySelector(`#${details.name}`)
                writeDescription(details.species.url, detailsPok)
            });
          pokemonsList.appendChild(listItem);
        });
    });
};

const prevImg = () => {
    if (currentSprite === 0) {
        currentSprite = sprites.length - 1
    }else{
        currentSprite--;
    }
    pokeImg.src = sprites[currentSprite]
}

const nextImg = () => {
    if (currentSprite === sprites.length - 1) {
        currentSprite = 0;
    }else{
        currentSprite++;
    }
    pokeImg.src = sprites[currentSprite];
}

const nextPokemon = () => {
    printPokemon(currentPokemon.id + 1);
}

const prevPokemon = () => {
    if(currentPokemon.id === 1){
        currentPokemon.id = 200;
    }
    printPokemon(currentPokemon.id - 1);
}

const nextPokemons = () => {
    fetchData(listPokemons.next).then(newData => {
        printPokemons(newData.next);
    });
};

const prevPokemons = () => {
    fetchData(listPokemons.next).then(newData => {
        printPokemons(newData.previous);
    });
};

const searchPokemon = () => {
    event.preventDefault();
    const input = event.target.search;
    fetchData(`${BASE_API}/pokemon/${input.value}`).then ((data) => {
        printPokemon(data.name);
    });
    //fetchData(`${BASE_API}/pokemon/${input.value}`).then((data) => {

};

printPokemon(1);
printPokemons(`${BASE_API}/pokemon?limit=15&offset=0`);