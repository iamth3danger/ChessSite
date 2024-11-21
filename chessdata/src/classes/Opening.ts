import { PercentageInfo } from './PercentageInfo';

import { IOpeningData } from "./IOpeningData";

class SubOpening {
  private subOpening: string;
  private count: number = 0;

  constructor(subOpening: string) {
    this.subOpening = subOpening;
    this.increaseCount();
  }

  increaseCount() {
    this.count++;
  }

  getSubOpening() {
    return this.subOpening;
  }

  getCount() {
    return this.count;
  }
}

export class Opening {
  private openingName: string;
  private subOpenings: SubOpening[] = [];

  private resultsObj = <IOpeningData>{
    wins : 0,
    draws : 0,
    losses : 0,
    gameNumber : 0,
  };

  constructor(openingName: string, result: string) {
    (this.openingName = openingName), this.updateOpeningResults(result);
  }

  updateSubOpening(opening: string) {
    for (var sub of this.subOpenings) {
      if (sub.getSubOpening() === opening) {
        sub.increaseCount();
        return;
      }
    }
    this.subOpenings.push(new SubOpening(opening));
  }

  updateOpeningResults(result: string): void {
    this.resultsObj.gameNumber++;
    if (result === "win") this.resultsObj.wins += 1;
    else if (result === "loss") this.resultsObj.losses += 1;
    else if (result === "draw") this.resultsObj.draws += 1;
  }

  getOpeningName() {
    return this.openingName;
  }

  getOpeningData() {
    return this.resultsObj;
  }
}
