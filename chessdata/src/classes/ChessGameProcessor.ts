import { WeeklyData } from './WeeklyData';
import { PercentageInfo } from './PercentageInfo';
import { ChessGameFetcher } from './ChessGameFetcher';
import { IResultName, IGameInfo, GameInfo } from './GameInfo';
import { OpeningResults } from './OpeningResults';

export class ChessGameProcessor {
  gameInfo: GameInfo[];
  openingResults: OpeningResults = new OpeningResults();
  percentageInfo: PercentageInfo[] = [];
  importantPercentageInfo: PercentageInfo[] = [];
  weeklyData: WeeklyData[] = [];

  constructor(gameInfo: GameInfo[]) {
    this.gameInfo = gameInfo;
  }

  init(){
    this.findResults();
  }

  private findResults() {
    for (var info of this.gameInfo) {
      this.openingResults.updateOpeningResults(info.getResultName());
    }
  }

  getResults(){
    return this.openingResults;
  }


}