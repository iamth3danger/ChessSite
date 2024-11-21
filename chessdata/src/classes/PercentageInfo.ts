import { IOpeningData } from "./IOpeningData";
import { IPercentageInfo } from "./IPercentageInfo";


export class PercentageInfo {
  opening: string;

  private percentObj = <IPercentageInfo>{
    totalGames: 0,
    winPercentage: 0,
    lossPercentage: 0,
    drawPercentage: 0,
  };

  constructor(obj: IOpeningData, opening: string) {
    this.opening = opening;
    this.percentObj.totalGames = obj.gameNumber;
    this.percentObj.winPercentage = this.findPercentage(obj.wins, this.percentObj.totalGames);
    this.percentObj.lossPercentage = this.findPercentage(obj.losses, this.percentObj.totalGames);
    this.percentObj.drawPercentage = this.findPercentage(obj.draws, this.percentObj.totalGames);
  }

  private findPercentage(part: number, whole: number) {
    return (part / whole) * 100;
  }

  getPercentObj() {return this.percentObj;}

  toString(): string {
    return `Opening: ${this.opening} Total games: ${
      this.percentObj.totalGames
    }, Win percentage: ${this.percentObj.winPercentage.toFixed(
      2
    )}, Loss percentage: ${this.percentObj.lossPercentage.toFixed(
      2
    )}, Draw percentage: ${this.percentObj.drawPercentage.toFixed(2)}`;
  }
}
