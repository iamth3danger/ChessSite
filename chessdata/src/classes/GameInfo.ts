
export interface IGameInfo {
  result: string;
  generalOpening: string;
  subOpening: string;
  sidePlayed: string;
  opponent: string;
  accuracyWhite: number;
  accuracyBlack: number;
  datetime: Date;
  weekSinceStart: number;
}

export interface IResultName{
    generalOpening: string;
    subOpening: string;
    result: string;
    accuracy : number;
    weekSince : number
}

export interface IWeekInfo{
    weekNumber: number;
    accuracy: number;
    win: boolean;
}

export class GameInfo {
  private sidePlayed: string;
  private opponent: string;
  private accuracyWhite: number;
  private accuracyBlack: number;
  private datetime: Date;
  private weekSinceStart: number;

  private resultNameObj = <IResultName>{};
  private weekInfoObj = <IWeekInfo>{};

  constructor(obj: IGameInfo) {
    this.resultNameObj.result = obj.result;
    this.resultNameObj.generalOpening = obj.generalOpening;
    this.resultNameObj.subOpening = obj.subOpening;
    this.sidePlayed = obj.sidePlayed;
    this.opponent = obj.opponent;
    this.accuracyWhite = obj.accuracyWhite;
    this.accuracyBlack = obj.accuracyBlack;
    this.datetime = obj.datetime;
    this.weekSinceStart = obj.weekSinceStart;
    this.resultNameObj.weekSince = obj.weekSinceStart;

    this.weekInfoObj.accuracy = this.sidePlayed === "white" ? obj.accuracyWhite : obj.accuracyBlack;
    this.resultNameObj.accuracy = this.weekInfoObj.accuracy;
    this.weekInfoObj.weekNumber = obj.weekSinceStart;
    this.weekInfoObj.win = obj.result === "win";
  }

  getResultName() {return this.resultNameObj;}
  getWeekInfo() {return this.weekInfoObj;}

//   toString(): Record<string, string> {
//     return {
//       result: this.result,
//       side: this.sidePlayed,
//       opening: this.generalOpening,
//     };
//   }
}
