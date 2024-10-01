import fetch from "node-fetch";
import { ChessMoveSender } from "./ChessMoveSender";


interface Player {
  rating: number;
  result: string;
  "@id": string;
  username: string;
  uuid: string;
}

interface Game {
  url: string;
  pgn: string;
  time_control: string;
  end_time: number;
  rated: boolean;
  accuracies?: {
    white: number;
    black: number;
  };
  tcn: string;
  uuid: string;
  initial_setup: string;
  fen: string;
  time_class: string;
  rules: string;
  white: Player;
  black: Player;
  eco: string;
}

interface ChessGames {
  games: Game[];
}

class GameInfo {
  result: string;
  opening: string;
  sidePlayed: string;
  opponent: string;
  accuracyWhite: number;
  accuracyBlack: number;
  datetime: Date;


 constructor(result: string, opening: string, sidePlayed: string, opponent: string, accuracyWhite: number, accuracyBlack: number, datetime: Date) {
    this.result = result;
    this.opening = opening;
    this.sidePlayed = sidePlayed;
    this.opponent = opponent;
    this.accuracyWhite = accuracyWhite;
    this.accuracyBlack = accuracyBlack;
    this.datetime = datetime;
 }

  toString(): Record<string, string> {
    return {
      result: this.result,
      side: this.sidePlayed,
      opening: this.opening,
    };
  }
}

class ChessGameFetcher {
  predefinedOpenings: string[] = [
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

  chess_openings: Record<
    string,
    {
      wins: number;
      losses: number;
      draws: number;
      subOpenings: Record<string, number>;
    }
  > = {};
  user_opening_data: Record<
    string,
    {
      wins: number;
      losses: number;
      draws: number;
      subOpenings: Record<string, number>;
    }
  > = {};
  user_opening_percentages: Record<
    string,
    {
      totalGames: number;
      winPercentage: number;
      lossPercentage: number;
      drawPercentage: number;
    }
  > = {};
  moves: string[] = [];
  username: string;
  apiURL: string;
  games: Game[] = [];
  gameInfo: GameInfo[] = [];
  regex: RegExp = /openings\/([A-Za-z-]+)/;
  chessMoveSender: ChessMoveSender;

  constructor(username: string) {
    this.username = username;
    this.apiURL = `https://api.chess.com/pub/player/${username}/games/2024/08`;

    this.predefinedOpenings.forEach((opening) => {
      this.chess_openings[opening] = {
        wins: 0,
        losses: 0,
        draws: 0,
        subOpenings: {},
      };
    });

    this.chessMoveSender = new ChessMoveSender();
    this.init();
  }

  async fetchGameArchives(): Promise<void> {
    try {
      const response = await fetch(this.apiURL);
      if (response.ok) {
        const data = (await response.json()) as ChessGames;
        this.games = data.games;
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      // Add a type check to confirm that the error has a 'message' property
      if (error instanceof Error) {
        console.error(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      } else {
        // Handle the case where the error is not an instance of Error
        console.error("An unexpected error occurred");
      }
    }
  }

    processChessString(input: string): void {
    const cleanedGameData = input.replace(/\[.*?\]|\{.*?\}/g, "").trim();
    this.moves.push(cleanedGameData);
}


  logOpenings(): void {
    this.games.forEach((game) => {
      let opening = game.eco;
      let accuracyWhite = game.accuracies?.white?? 0;
      let accuracyBlack = game.accuracies?.black?? 0;

      let date: Date = new Date(2024, 4);

      const extractedDate = this.extractUTCDateTime(game.pgn);

    
      if (extractedDate) {
        date = extractedDate;
      }

      this.processChessString(game.pgn);

      const sidePlayed =
        game.white.username === this.username ? "white" : "black";
      let result =
        sidePlayed === "white" ? game.white.result : game.black.result;

      result = this.normalizeResult(result);

      const match = opening.match(this.regex);
      if (match && match[1]) {
        opening = match[1].replace(/-$/, "").replace(/-/g, " ");
      }
      const matchedOpening = this.predefinedOpenings.find((openingName) =>
        opening.includes(openingName)
      );

      if (matchedOpening) {
        this.updateOpeningResults(matchedOpening, result, opening);
      } else {
        console.log(`Unmatched opening: ${opening}`);
      }

      this.gameInfo.push(new GameInfo(result, opening, sidePlayed, game.black.username, accuracyWhite, accuracyBlack, date));

    });
  }

  extractUTCDateTime(data: string): Date | null {
    // Regular expressions to extract UTCDate and UTCTime
    const dateRegex = /\[UTCDate\s+"(\d{4}\.\d{2}\.\d{2})"\]/;
    const timeRegex = /\[UTCTime\s+"(\d{2}:\d{2}:\d{2})"\]/;

    // Extract UTCDate and UTCTime
    const dateMatch = data.match(dateRegex);
    const timeMatch = data.match(timeRegex);

    // If both date and time are found, combine them into a Date object
    if (dateMatch && timeMatch) {
        const datePart = dateMatch[1].replace(/\./g, '-'); // Convert YYYY.MM.DD to YYYY-MM-DD
        const timePart = timeMatch[1]; // Already in HH:mm:ss format

        // Combine date and time and create a Date object
        const dateTimeString = `${datePart}T${timePart}Z`;
        return new Date(dateTimeString); // Returns a Date object in UTC
    }

    // If either date or time is missing, return null
    return null;
}

  normalizeResult(result: string): string {
    if (["checkmated", "timeout", "resigned"].includes(result)) return "loss";
    if (["stalemate", "agreed", "repetition", "insufficient"].includes(result))
      return "draw";
    return result === "win" ? "win" : result;
  }

  updateOpeningResults(
    matchedOpening: string,
    result: string,
    opening: string
  ): void {
    if (result === "win") this.chess_openings[matchedOpening].wins += 1;
    else if (result === "loss") this.chess_openings[matchedOpening].losses += 1;
    else if (result === "draw") this.chess_openings[matchedOpening].draws += 1;

    if (this.chess_openings[matchedOpening].subOpenings[opening]) {
      this.chess_openings[matchedOpening].subOpenings[opening] += 1;
    } else {
      this.chess_openings[matchedOpening].subOpenings[opening] = 1;
    }
  }

  returnOpeningData(): void {
    Object.keys(this.chess_openings).forEach((key) => {
      const gameNumber =
        this.chess_openings[key].wins +
        this.chess_openings[key].losses +
        this.chess_openings[key].draws;
      if (gameNumber > 0)
        this.user_opening_data[key] = this.chess_openings[key];
    });
  }

  getPercentages(): void {
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
  }

  async init(): Promise<void> {
    await this.fetchGameArchives();
    this.logOpenings();
    //console.log(this.games[0]);
  }
}

// Usage example
const username = "dangertosh";
const chessGameFetcher = new ChessGameFetcher(username);
