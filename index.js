const readline = require("readline");
const parser = require("./parser");

function main() {
  parser.initializeData();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Welcome to the Pokémon search tool!");
  console.log(
    "You can search Pokémon by generation, name, type, or view all Pokémon."
  );

  const promptUser = () => {
    rl.question(
      "Please choose an option: Press '1' to show Pokémon by generation, '2' by name, '3' by type, '4' to show all Pokémon, or 'q' to exit: ",
      (user_selection) => {
        switch (user_selection) {
          case "q":
            rl.close();
            break;
          case "1":
            rl.question(
              "Select a number from 1-6 to show all Pokémon by generation: ",
              (gen_selection) => {
                parser.show_pokemons_by_gen(gen_selection);
                promptUser();
              }
            );
            break;
          case "2":
            rl.question(
              "Enter the name of the Pokémon (or 'q' to exit): ",
              (user_input_by_name) => {
                parser.search_pokemon_by_name(user_input_by_name);
                promptUser();
              }
            );
            break;
          case "3":
            rl.question(
              "Enter a type to view all Pokémon by their type (e.g., 'fire', 'bug', 'poison', etc.): ",
              (type_selection) => {
                parser.show_pokemons_by_type(type_selection);
                promptUser();
              }
            );
            break;
          case "4":
            showAllPokemonPage();
            break;
          default:
            console.log("Invalid option. Please choose a valid option.");
            promptUser();
        }
      }
    );
  };

  function showAllPokemonPage() {
    rl.question(
      "Enter the page number (1 - ...) or '0' to exit: ",
      (page_number) => {
        if (page_number === "0") {
          promptUser();
        } else {
          const parsedPageNumber = parseInt(page_number, 10);

          if (parsedPageNumber >= 1) {
            parser.show_all_pokemon(parsedPageNumber, () => {
              showAllPokemonPage();
            });
          } else {
            console.log(
              "Invalid page number. Please enter a valid page number."
            );
            showAllPokemonPage();
          }
        }
      }
    );
  }

  promptUser();
}

main();
