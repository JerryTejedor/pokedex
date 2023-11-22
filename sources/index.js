// Obtiene el elemento HTML donde se mostrarán los Pokémon.
const listapokemon = document.getElementById('listpokemon');

// URL base de la API de Pokémon.
let URL = "https://pokeapi.co/api/v2/pokemon/";

// Recoge todos los botones con la clase .btn-header
const botones = document.querySelectorAll('.btn-header');

// Arreglo para almacenar todas las promesas de las peticiones fetch
const fetchPromises = [];

// Loop para crear y almacenar promesas de fetch para los primeros 151 Pokémon.
for (let i = 1; i <= 151; i++) {
     const fetchPromise = fetch(URL + i)
    .then((Response) => Response.json());
    fetchPromises.push(fetchPromise);
};

// Ejecuta todas las promesas y una vez que todas estén completas, muestra los Pokémon en orden.
Promise.all(fetchPromises)
    .then(allPokemonData => {
        // Ordena el arreglo de Pokémon por ID.
        allPokemonData.sort((a, b) => a.id - b.id);
        // Llama a la función mostrarpokemon para cada Pokémon.
        allPokemonData.forEach(pokemonData => mostrarpokemon(pokemonData));
    })
    .catch(error => {
        // En caso de error, se muestra un mensaje en la consola.
        console.error("Hubo un error al recuperar los datos de los Pokémon:", error);
    });

// Función que muestra la información de un Pokémon en la página.
function mostrarpokemon(data) {

    // Extrae y formatea los tipos del Pokémon.
    let tipos = data.types.map((type) => ` <p class="${type.type.name}">${type.type.name}</p>`);
    tipos = tipos.join('')

    // Formatea el ID del Pokémon para que tenga un formato de tres dígitos.
    let pokeId = data.id.toString();
    
    // Crea un nuevo div y añade la información del Pokémon.
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="pokemon">
            <p class="pokemon-id-back">#${pokeId}</p>
            <div class="pokemon-img">
                <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
            </div>
            <div class="pokemon-info">
                <div class="nombre-contenedor">
                    <p class="pokemon-id">#${pokeId}</p>
                    <h2 class="pokemon-nombre">${data.name}</h2>
                </div>
                <div class="pokemon-tipos">
                         ${tipos}
                </div>
                <div class="pokemon-stats">
                    <p class="stat">${data.height}M</p>
                    <p class="stat">${data.weight}KG</p>
                </div>
            </div>
        </div>`;

    // Añade el div al elemento listapokemon.
    listapokemon.append(div);
}

// Añade un event listener a cada botón. Cuando se hace click en un botón, filtra y muestra los Pokémon según el tipo.
botones.forEach( boton => boton.addEventListener('click', (e) => {
    // Obtener el ID del botón presionado
    const botonesId = e.currentTarget.id;

    // Limpia el contenido de listapokemon
    listapokemon.innerHTML = "";

    // Vuelve a hacer fetch a los datos de los Pokémon (esto podría optimizarse)
    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {
            // Si el ID del botón es 'ver-todos', muestra todos los Pokémon
            if(botonesId === 'ver-todos'){
                mostrarpokemon(data);
            }
            // Extrae los tipos de Pokémon del dato actual.
            const tipos = data.types.map(type => type.type.name);
            // Si alguno de los tipos coincide con el ID del botón, muestra el Pokémon
            if(tipos.some(tipo => tipo.includes(botonesId))){
                mostrarpokemon(data);
            } 
        });
    };

}));


