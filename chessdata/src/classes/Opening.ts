import { PercentageInfo } from "./PercentageInfo";

import { IOpeningData } from "./IOpeningData";
import { WeeklyData } from "./WeeklyData";
import { IResultName, IWeekInfo } from "./GameInfo";
import WeekNumber from "react-datepicker/dist/week_number";

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
  private accuracyCount = 0;
  private percentageInfo: PercentageInfo;
  private weeklyData: WeeklyData; 

  private resultsObj = <IOpeningData>{
    wins: 0,
    draws: 0,
    losses: 0,
    accuracy: 0,
    gameNumber: 0,
  };

  constructor(openingName: string) {
    this.openingName = openingName;
    this.percentageInfo = new PercentageInfo();
    this.weeklyData = new WeeklyData();
  }

  updateOpening(obj : IResultName) {
    this.updateOpeningResults(obj.result);
    this.percentageInfo.updatePercentage(this.resultsObj);
    const weeklyObj = <IWeekInfo>{
      weekNumber : obj.weekSince,
      accuracy : obj.accuracy,
      win : obj.result === "win"
    }

    this.weeklyData.addValue(weeklyObj);
    this.updateAccuracy(obj.accuracy);
    this.updateSubOpening(obj.subOpening);
  }

  private updateSubOpening(opening: string) {
    for (var sub of this.subOpenings) {
      if (sub.getSubOpening() === opening) {
        sub.increaseCount();
        return;
      }
    }
    this.subOpenings.push(new SubOpening(opening));
  }

  private updateOpeningResults(result: string): void {
    this.resultsObj.gameNumber++;
    if (result === "win") this.resultsObj.wins += 1;
    else if (result === "loss") this.resultsObj.losses += 1;
    else if (result === "draw") this.resultsObj.draws += 1;
  }

  private updateAccuracy(accuracy: number) {
    if (accuracy != 0) {
      this.accuracyCount++;
      this.resultsObj.accuracy =
        ((this.accuracyCount - 1) * this.resultsObj.accuracy + accuracy) /
        this.accuracyCount;
    }
  }

  getPercentage(){
    return this.percentageInfo;
  }

  getWeeklyData(){
    return this.weeklyData.getData();
  }

  getGameTotal(){
    return this.resultsObj.gameNumber;
  }

  getOpeningName() {
    return this.openingName;
  }

  getOpeningData() {
    return this.resultsObj;
  }

  getAvgAccuracy() {
    return parseFloat(this.resultsObj.accuracy.toFixed(1));
  }
}
