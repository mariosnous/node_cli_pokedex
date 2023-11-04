const axios = require("axios");
const csvParser = require("csv-parser");
const streamifier = require("streamifier"); // Import the streamifier library

const data = []; // Array to store Pokémon data

// Function to initialize Pokémon data from a CSV file in the web
async function initializeData() {
  try {
    const response = await axios.get(
      "https://gist.githubusercontent.com/armgilles/194bcff35001e7eb53a2a8b441e8b2c6/raw/92200bc0a673d5ce2110aaad4544ed6c4010f687/pokemon.csv"
    ); // Replace with the actual URL

    // Convert the response data into a readable stream
    const dataStream = streamifier.createReadStream(response.data);

    const parsedData = await new Promise((resolve, reject) => {
      const parsed = [];
      dataStream
        .pipe(csvParser())
        .on("data", (row) => {
          parsed.push(row);
        })
        .on("end", () => {
          resolve(parsed);
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    data.push(...parsedData); // Push the parsed data to the 'data' array
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

// Function to format Pokémon information as a string
function formatPokemonInfo(pokemon) {
  return `
Number: ${pokemon["#"]}
Name: ${pokemon["Name"]}
Type: ${pokemon["Type 1"]},${pokemon["Type 2"]}
Total: ${pokemon["Total"]}
HP: ${pokemon["HP"]}
Attack: ${pokemon["Attack"]}
Defense: ${pokemon["Defense"]}
Sp. Atk: ${pokemon["Sp. Atk"]}
Sp. Def: ${pokemon["Sp. Def"]}
Speed: ${pokemon["Speed"]}
Generation: ${pokemon["Generation"]}
Legendary: ${pokemon["Legendary"]}
------------------------
`;
}

// Function to display a page of Pokémon based on page number
function show_pokemon_page(page_number) {
  const items_per_page = 10;
  const start_index = (page_number - 1) * items_per_page;
  const end_index = start_index + items_per_page;
  const page_data = data.slice(start_index, end_index);

  if (page_data.length > 0) {
    page_data.forEach((pokemon) => {
      console.log(formatPokemonInfo(pokemon));
    });
  } else {
    console.log("No Pokémon on this page");
  }
}

// Function to show all Pokémon data, given a page number and a callback function
function show_all_pokemon(page_number, callback) {
  const total_pages = Math.ceil(data.length / 10);
  if (page_number > total_pages) {
    console.log("Invalid page number. Please enter a valid page number.");
    callback();
  } else {
    show_pokemon_page(page_number);
    callback();
  }
}

// Function to search for Pokémon by name and display their information
function search_pokemon_by_name(name) {
  const matchingPokemon = data.filter(
    (item) => item.Name.toLowerCase() === name.toLowerCase()
  );

  if (matchingPokemon.length > 0) {
    matchingPokemon.forEach((pokemon) => {
      console.log(formatPokemonInfo(pokemon));
    });
  } else {
    console.log(`Pokemon "${name}" not found in dataset`);
  }
}

// Function to display Pokémon based on their generation
function show_pokemons_by_gen(gen) {
  const genNumber = parseInt(gen, 10);

  if (isNaN(genNumber) || genNumber < 1 || genNumber > 6) {
    console.log("Invalid Generation Selection. Choose between 1 - 6");
    return;
  }

  const matchingPokemon = data.filter((item) => item.Generation == genNumber);

  if (matchingPokemon.length > 0) {
    matchingPokemon.forEach((pokemon) => {
      console.log(formatPokemonInfo(pokemon));
    });
  } else {
    console.log(`No Pokémon found in Generation ${genNumber}`);
  }
}

// Function to display Pokémon based on their type
function show_pokemons_by_type(type) {
  const matchingPokemon = data.filter(
    (item) => item["Type 1"].toLowerCase() === type.toLowerCase()
  );

  if (matchingPokemon.length > 0) {
    matchingPokemon.forEach((pokemon) => {
      console.log(formatPokemonInfo(pokemon));
    });
  } else {
    console.log(`No Pokémon Type found for type "${type}"`);
  }
}

module.exports = {
  initializeData,
  show_pokemon_page,
  search_pokemon_by_name,
  show_pokemons_by_gen,
  show_pokemons_by_type,
  show_all_pokemon,
};
