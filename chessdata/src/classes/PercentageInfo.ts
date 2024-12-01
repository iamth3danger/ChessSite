import { IOpeningData } from "./IOpeningData";
import { IPercentageInfo} from "./IPercentageInfo";


export class PercentageInfo {
  private percentObj = <IPercentageInfo>{
    winPercentage: 0,
    lossPercentage: 0,
    drawPercentage: 0,
  };

  constructor() {}

  updatePercentage(obj: IOpeningData) {
    this.percentObj.winPercentage = 100 * (obj.wins / obj.gameNumber);
    this.percentObj.drawPercentage = 100 * (obj.draws / obj.gameNumber);
    this.percentObj.lossPercentage = 100 * (obj.losses / obj.gameNumber);
  }

  private roundPercentage() {
    this.percentObj.winPercentage = parseFloat(
      this.percentObj.winPercentage.toFixed(2)
    );
    this.percentObj.drawPercentage = parseFloat(
      this.percentObj.drawPercentage.toFixed(2)
    );
    this.percentObj.lossPercentage = parseFloat(
      this.percentObj.lossPercentage.toFixed(2)
    );
  }

  getWin() {
    this.roundPercentage();
    return this.percentObj.winPercentage;
  }

  getDraw() {
    this.roundPercentage();
    return this.percentObj.drawPercentage;
  }

  getLoss() {
    this.roundPercentage();
    return this.percentObj.lossPercentage;
  }
}
