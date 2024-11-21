import { ChessMoveSender } from "./ChessMoveSender";
import { PercentageInfo } from "./PercentageInfo";
import { Opening } from "./Opening";
import { OpeningResults } from "./OpeningResults";

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

interface OpeningStats {
  opening: string;
  totalGames: number;
  winPercentage: number;
}

interface ChessGames {
  games: Game[];
}

interface IGameInfo{
  result: string;
  opening: string;
  sidePlayed: string;
  opponent: string;
  accuracyWhite: number;
  accuracyBlack: number;
  datetime: Date;
  weekSinceStart: number;
}

class GameInfo {
  private result: string;
  private opening: string;
  private sidePlayed: string;
  private opponent: string;
  private accuracyWhite: number;
  private accuracyBlack: number;
  private datetime: Date;
  private weekSinceStart: number;

  constructor(obj : IGameInfo) {
    this.result = obj.result;
    this.opening = obj.opening;
    this.sidePlayed = obj.sidePlayed;
    this.opponent = obj.opponent;
    this.accuracyWhite = obj.accuracyWhite;
    this.accuracyBlack = obj.accuracyBlack;
    this.datetime = obj.datetime;
    this.weekSinceStart = obj.weekSinceStart;
  }

  toString(): Record<string, string> {
    return {
      result: this.result,
      side: this.sidePlayed,
      opening: this.opening,
    };
  }
}

export class ChessGameFetcher {
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
  
  //user_opening_data: OpeningData[] = [];
  percentageInfoArr: PercentageInfo[] = [];

  moves: string[] = [];
  username: string;
  month: string;
  year: string;
  apiURL: string;
  games: Game[] = [];
  gameInfo: GameInfo[] = [];
  regex: RegExp = /openings\/([A-Za-z-]+)/;
  chessMoveSender: ChessMoveSender;
  openingResults : OpeningResults = new OpeningResults();

  constructor(username: string, year: string, month: string) {
    this.username = username;
    this.year = year;
    this.month = month;
    this.apiURL = `https://api.chess.com/pub/player/${username}/games/${year}/${month}`;

    this.predefinedOpenings.forEach((opening) => {
      this.chess_openings[opening] = {
        wins: 0,
        losses: 0,
        draws: 0,
        subOpenings: {},
      };
    });

    this.chessMoveSender = new ChessMoveSender();
  }

  async fetchGames(): Promise<void> {
    await this.fetchGameArchives();
    this.logOpenings();
    this.returnOpeningData();
    this.getPercentages();
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
      if (error instanceof Error) {
        console.error(
          "There has been a problem with your fetch operation: ",
          error.message
        );
      } else {
        console.error("An unexpected error occurred");
      }
    }
  }

  processChessString(input: string): void {
    const cleanedGameData = input.replace(/\[.*?\]|\{.*?\}/g, "").trim();
    this.moves.push(cleanedGameData);
  }


  //Grabs useful data from the chess Api and processes it
  logOpenings(): void {
    this.games.forEach((game) => {
      let opening = game.eco;
      let endTime = game.end_time;
      let date = new Date(endTime * 1000);
      let startMonth = parseInt(this.month.replace("0", ""));
      let startDate = new Date(`${startMonth}/1/${this.year}`);
      let unixStartDate = startDate.getTime() / 1000;

      this.processChessString(game.pgn);

      const sidePlayed =
        game.white.username === this.username ? "white" : "black";

      let result = this.normalizeResult(
        sidePlayed === "white" ? game.white.result : game.black.result
      );

      const matchedOpening = this.matchOpening(opening);

      if (matchedOpening) {
        this.openingResults.updateOpeningResults(matchedOpening, result, opening);
      } else {
        console.log(`Unmatched opening: ${opening}`);
      }

      const gameInfoObj = <IGameInfo>{
        result: result,
        opening: opening,
        sidePlayed: sidePlayed,
        opponent: sidePlayed !== "white" ? game.white.username : game.black.username,
        datetime: date,
        accuracyWhite: game.accuracies?.white ?? 0,
        accuracyBlack: game.accuracies?.black ?? 0,
        weekSinceStart: Math.floor((endTime - unixStartDate) / (3600 * 24 * 7)),
      };

      this.gameInfo.push(
        new GameInfo(
          gameInfoObj
        )
      );
    });
  }


  matchOpening(openingName : string){
    const match = openingName.match(this.regex);
    if (match && match[1]) {
      openingName = match[1].replace(/-$/, "").replace(/-/g, " ");
    }
    return this.predefinedOpenings.find((openingName) =>
      openingName.includes(openingName)
    );
  }

  normalizeResult(result: string): string {
    if (["checkmated", "timeout", "resigned"].includes(result)) return "loss";
    if (["stalemate", "agreed", "repetition", "insufficient"].includes(result))
      return "draw";
    return result === "win" ? "win" : result;
  }


  getPercentages(): void {
    for (var opening of this.openingResults.getOpenings()) {

      this.percentageInfoArr.push(
        new PercentageInfo(
          opening.getOpeningData(),
          opening.getOpeningName()
        )
      );
    }  

    this.percentageInfoArr.sort((a, b) => {
      return b.getPercentObj().totalGames - a.getPercentObj().totalGames;
    });
  }

  
}
