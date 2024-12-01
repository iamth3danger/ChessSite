import { ChessMoveSender } from "./ChessMoveSender";
import { PercentageInfo } from "./PercentageInfo";
import { Opening } from "./Opening";
import { OpeningResults } from "./OpeningResults";
import { IGameInfo, GameInfo } from "./GameInfo";

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

  //user_opening_data: OpeningData[] = [];
  percentageInfoArr: PercentageInfo[] = [];

  username: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  apiURL: string;
  games: Game[] = [];
  gameInfo: GameInfo[] = [];
  regex: RegExp = /openings\/([A-Za-z-]+)/;
  chessMoveSender: ChessMoveSender;
  openingResults: OpeningResults = new OpeningResults();

  constructor(
    username: string,
    startYear: string,
    startMonth: string,
    endYear: string,
    endMonth: string
  ) {
    this.username = username;
    this.startYear = startYear;
    this.startMonth = startMonth;

    this.endYear = endYear;
    this.endMonth = endMonth;

    this.apiURL = `https://api.chess.com/pub/player/${username}/games/${startYear}/${startMonth}`;

    this.chessMoveSender = new ChessMoveSender();
  }

  // async fetchGames(): Promise<void> {
  //   await this.fetchGameArchives();
  //   this.logOpenings();
  //   this.returnOpeningData();
  //   this.getPercentages();
  // }

  async fetchGameArchives(): Promise<void> {
    let endYear = parseInt(this.endYear);
    let endMonth = parseInt(this.endMonth.replace("0", ""));
    let year = parseInt(this.startYear);
    let month = parseInt(this.startMonth.replace("0", ""));
    try {
      while (year != endYear || month != endMonth) {
        let strMonth = month < 10 ? `0${month}` : month;
        let apiURL = `https://api.chess.com/pub/player/${this.username}/games/${year}/${strMonth}`;
        const response = await fetch(apiURL);
        if (response.ok) {
          const data = (await response.json()) as ChessGames;
          this.games.push(...data.games);
          //Possible error over 100000 elements
        } else {
          throw new Error("Network response was not ok");
        }

        month = (month % 12) + 1;
        if (month == 1) year += 1;
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

  //Grabs useful data from the chess Api and processes it
  logOpenings(): GameInfo[] {
    this.games.forEach((game) => {

      let opening = game.eco;
      let endTime = game.end_time;
      let date = new Date(endTime * 1000);
      let startMonth = parseInt(this.startMonth.replace("0", ""));
      let startDate = new Date(`${startMonth}/1/${this.startYear}`);
      let unixStartDate = startDate.getTime() / 1000;
  
      const sidePlayed =
        game.white.username === this.username ? "white" : "black";

      let result = this.normalizeResult(
        sidePlayed === "white" ? game.white.result : game.black.result
      );

      const matchedOpening = this.matchOpening(opening);

      if (!matchedOpening) {
        console.log(`Unmatched opening: ${opening}`);
      }

      const gameInfoObj = <IGameInfo>{
        result: result,
        generalOpening: matchedOpening,
        subOpening: opening,
        sidePlayed: sidePlayed,
        opponent:
          sidePlayed !== "white" ? game.white.username : game.black.username,
        datetime: date,
        accuracyWhite: game.accuracies?.white ?? 0,
        accuracyBlack: game.accuracies?.black ?? 0,
        weekSinceStart: Math.floor((endTime - unixStartDate) / (3600 * 24 * 7)),
      };

      this.gameInfo.push(new GameInfo(gameInfoObj));
    });

      console.log(this.games[2]);
    return this.gameInfo;
  }

  private matchOpening(openingName: string) {
    const match = openingName.match(this.regex);
    if (match && match[1]) {
      openingName = match[1].replace(/-$/, "").replace(/-/g, " ");
    }
    return this.predefinedOpenings.find((name) => openingName.includes(name));
  }

  private normalizeResult(result: string): string {
    if (["checkmated", "timeout", "resigned"].includes(result)) return "loss";
    if (["stalemate", "agreed", "repetition", "insufficient"].includes(result))
      return "draw";
    return result === "win" ? "win" : result;
  }
}
