const ChessMoveSender = require("./ChessMoveSender");

class GameResult {
  constructor(result, opening, sidePlayed) {
    this.result = result;
    this.opening = opening;
    this.sidePlayed = sidePlayed;
  }

  toString() {
    return {
      result: this.result,
      side: this.sidePlayed,
      opening: this.opening,
    };
  }
}

class ChessGameFetcher {
  predefinedOpenings = [
    "Alekhine Defense",
    "Alekhines",
    "Alapin Variation",
    "Amar Opening",
    "Benko Gambit",
    "Benoni Defense",
    "Bishops Opening",
    "BogoIndian Defense",
    "Birds Opening",
    "Budapest Gambit",
    "Caro Kann Defense",
    "Catalan Opening",
    "Center Game",
    "Classical Sicilian",
    "Colle System",
    "Dragon Variation",
    "Dutch Defense",
    "English Defense",
    "English Opening",
    "Four Knights Game",
    "French Defense",
    "Giuoco Piano Game",
    "Grunfeld Defense",
    "Grob Attack",
    "Kings Fianchetto Opening",
    "Kings Gambit",
    "Kings Indian Attack",
    "Kings Indian Defense",
    "Latvian Gambit",
    "London System",
    "Larsens Opening",
    "Modern Benoni",
    "Modern Defense",
    "Najdorf Variation",
    "Nimzo Indian Defense",
    "NimzoIndian Defense",
    "Nimzowitsch Defense",
    "Nimzowitsch Larsen Attack",
    "Orangutan Opening",
    "Owens Defense",
    "Panov Botvinnik Attack",
    "Petrovs Defense",
    "Philidor Defense",
    "Pirc Defense",
    "Queens Gambit",
    "Queens Gambit Accepted",
    "Queens Gambit Declined",
    "Queens Indian Defense",
    "Queens Pawn",
    "Reti Opening",
    "Reversed Sicilian",
    "Ruy Lopez",
    "Scandinavian Defense",
    "Scheveningen",
    "Scotch Game",
    "SemiSlav Defense",
    "Sicilian Defense",
    "Slav Defense",
    "Sokolsky Opening",
    "Sveshnikov Variation",
    "Stonewall Attack",
    "Tarrasch Defense",
    "Torre Attack",
    "The Cow",
    "Van Geet",
    "Van t Kruijs",
    "Veresov Attack",
    "Vienna Gambit",
    "Vienna Game",
  ];

  chess_openings = {};

  user_opening_data = {};

  user_opening_percentages = {};

  moves = [];

  constructor(username) {
    this.username = username;
    this.apiURL = `https://api.chess.com/pub/player/${username}/games/2024/08`;
    this.games = [];
    this.gameResults = [];
    this.chess_openings = {}; // Instance variable to track openings results
    this.regex = /openings\/([A-Za-z-]+)/;
    this.chessMoveSender = new ChessMoveSender();

    // Initialize the chess_openings dictionary with default values for each opening
    this.predefinedOpenings.forEach((opening) => {
      this.chess_openings[opening] = {
        wins: 0,
        losses: 0,
        draws: 0,
        subOpenings: {},
      };
    });

    // Call the init method to fetch the games and log openings
    this.init();
  }

  async fetchGameArchives() {
    try {
      const response = await fetch(this.apiURL);
      if (response.ok) {
        const data = await response.json();
      
        this.games = data.games; // Save games to the instance variable
        console.log(this.games);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation: ",
        error.message
      );
    }
  }

  storeGames(pgn) {
    const movesOnly = pgn
      .replace(/^.*?(?=1\.\s*e4)/ms, "")
      .replace(/\{.*?\}/g, "");

    // Split the moves into a list of formatted moves
    const moves = movesOnly
      .split(/\n/)
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const formattedMoves = [];
        const moveParts = line.split(/\s+/);
        // console.log(moveParts);
        for (let i = 0; i < moveParts.length; i += 2) {
          if (moveParts[i].length < 4)
            formattedMoves.push(`${moveParts[i]} ${moveParts[i + 1]}`);
          else if (moveParts[i].length >= 4) {
            let slice = moveParts[i].indexOf(".") + 1;
            moveParts[i] =
              moveParts[i].slice(0, slice) +
              " " +
              moveParts[i].slice(slice, moveParts[i].length);
            formattedMoves.push(`${moveParts[i]}${moveParts[i + 1]}`);
          }
        }
        return formattedMoves;
      });

    this.moves.push(moves);
  }

  logOpenings() {
    this.games.forEach((game) => {
      let opening = game.eco;
      this.storeGames(game.pgn);

      let sidePlayed =
        game.white.username === this.username ? "white" : "black";
      let result =
        sidePlayed === "white" ? game.white.result : game.black.result;

      // Normalize result for consistency
      if (
        result === "checkmated" ||
        result === "timeout" ||
        result === "resigned"
      )
        result = "loss";
      else if (
        result === "stalemate" ||
        result === "agreed" ||
        result === "repetition" ||
        result === "insufficient"
      )
        result = "draw";
      else if (result === "win") result = "win";

      const match = opening.match(this.regex);
      if (match && match[1]) {
        opening = match[1].replace(/-$/, "").replaceAll("-", " ");
      }
      const matchedOpening = this.predefinedOpenings.find((openingName) =>
        opening.includes(openingName)
      );

      if (matchedOpening) {
        if (result === "win") this.chess_openings[matchedOpening].wins += 1;
        else if (result === "loss")
          this.chess_openings[matchedOpening].losses += 1;
        else if (result === "draw")
          this.chess_openings[matchedOpening].draws += 1;

        if (opening in this.chess_openings[matchedOpening].subOpenings) {
          this.chess_openings[matchedOpening].subOpenings[opening] += 1;
        } else {
          this.chess_openings[matchedOpening].subOpenings[opening] = 1;
        }
      } else {
        console.log(`Unmatched opening: ${opening}`);
      }
    });

    // Log the updated chess_openings instance variable
  }

  returnOpeningData() {
    Object.keys(this.chess_openings).forEach((key) => {
      const gameNumber =
        this.chess_openings[key].wins +
        this.chess_openings[key].losses +
        this.chess_openings[key].draws;

      if (gameNumber > 0) {
        this.user_opening_data[key] = this.chess_openings[key];
      }
    });
  }

  getPercentages() {
    let count = 0;
    Object.keys(this.user_opening_data).forEach((key) => {
      const totalGames =
        this.user_opening_data[key].wins +
        this.user_opening_data[key].losses +
        this.user_opening_data[key].draws;
      count += totalGames;
      this.user_opening_percentages[key] = {
        totalGames,
        winPercentage: (this.user_opening_data[key].wins / totalGames) * 100,
        lossPercentage: (this.user_opening_data[key].losses / totalGames) * 100,
        drawPercentage: (this.user_opening_data[key].draws / totalGames) * 100,
      };
    });

    // Log the updated user_opening_percentages instance variable
    // Log the total number of games processed
  }

  async init() {
    // Call fetchGameArchives and logOpenings asynchronously
    await this.fetchGameArchives(); // Fetch the games
   // this.logOpenings(); // Log the openings
    //console.log(this.moves[0][0]);

    //console.log(strs);

    const ves = [
      "1. e4",
      "1. ..c6",
      "2. d4",
      "2. ..d5",
      "3. Nc3",
      "3. ..dxe4",
      "4. Nxe4",
      "5. Be2",
      "5. ..d6",
      "6. Nf3",
      "6. ..c5",
      "7. Bd3",
      "7. ..Nf6",
      "8. O-O",
      "8. ..e6",
      "9. Nc3",
      "9. ..Bc5",
      "1. e4",
      "1. ..c6",
      "11. e4",
      "11. ..c6"
    ];

    //console.log(console.log(this.games[0])); // Log the payload

    for (let i = 0; i < 4; i++){
      this.chessMoveSender.storeMoves(this.moves[i][0]);
    }
    //this.chessMoveSender.storeMoves(this.moves[0][0]);
  }
}

// Usage
const username = "dangertosh";
const chessGameFetcher = new ChessGameFetcher(username);
