import { Opening } from "./Opening";
import { IResultName } from "./GameInfo";

export class OpeningResults {
  private openings: Opening[] = [];
  private totalNumberGames: number = 0;

  constructor() {}

  getOpenings() {
    let openings = [];
    for (var open of this.openings) {
      if (open.getGameTotal() > 8) {
        openings.push(open);
      }
    }
    return openings;
  }

  updateOpeningResults(obj: IResultName) {
    for (var opening of this.openings) {
      if (opening.getOpeningName() === obj.generalOpening) {
        opening.updateOpening(obj);
        this.totalNumberGames++;
        return;
      }
    }
    this.addOpening(obj);
  }

  private addOpening(obj: IResultName) {
    let opening = new Opening(obj.generalOpening);
    opening.updateOpening(obj);
    this.openings.push(opening);
    this.totalNumberGames++;
  }

  getTotalNumberGames() {
    return this.totalNumberGames;
  }
}
