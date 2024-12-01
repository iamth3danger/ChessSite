import { ChessGameFetcher } from "./ChessGameFetcher";
import { PercentageInfo } from "./PercentageInfo";
import { ChessGameProcessor } from "./ChessGameProcessor";
import { OpeningResults } from "./OpeningResults";
import { Opening } from "./Opening";

// let Game = new ChessGameFetcher("dangertosh", "2024", "08");

// async function fetchOpenings() {
//   const gameFetcher = new ChessGameFetcher("dangertosh", "2024", "08");
//   await gameFetcher.fetchGameArchives();
//   let gameProcessor = new ChessGameProcessor(gameFetcher.logOpenings());
//   gameProcessor.init();

//   let openingResults: OpeningResults = gameProcessor.getResults();
//   let openings: Opening[] = openingResults.getOpenings();
//   for (var open of openings){
//     console.log(open.getOpeningName());
//   }
// }

// fetchOpenings();


let year = 2022;
let month = 1; 

while(month != 11 || year != 2024){
  console.log(`month : ${month} year ${year}`);

  month = (month % 12) + 1;
  if (month == 1) year += 1; 
}
