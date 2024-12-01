import { IWeekInfo } from "./GameInfo";

export interface WinPercentageData {
  week: number;
  winPercentage: number;
}

class Week {
  private weekNumber: number;
  private accuracy: number;
  private winPercentage: number;
  private totalGames = 0;

  constructor(obj: IWeekInfo) {
    this.weekNumber = obj.weekNumber;
    this.accuracy = obj.accuracy;
    this.winPercentage = 0;
    this.setWinPercentage(obj.win);
    this.totalGames++;
  }

  private setWinPercentage(win : boolean){
    let winNumber = win ? 1 : 0;
    let currentPercentage = this.winPercentage / 100
    this.winPercentage =
      100 * ((this.totalGames * currentPercentage + winNumber) /
      (this.totalGames + 1));
  }

  private setAccuracy(accuracy : number){
    this.accuracy =
      (this.totalGames * this.accuracy + accuracy) / (this.totalGames + 1);
  }

  getWeekNumber(): number {
    return this.weekNumber;
  }

  getWinPercentageData(){
    return <WinPercentageData>{
      week: this.weekNumber,
      winPercentage: this.winPercentage
    };
  }

  addValue(accuracy: number, win: boolean) {
    this.setAccuracy(accuracy);  
    this.setWinPercentage(win);
    
    this.totalGames++;
  }
}

export class WeeklyData {
  private weeks: Week[] = [];

  constructor() {}

  addValue(obj: IWeekInfo) {
    for (var week of this.weeks) {
      if (week.getWeekNumber() === obj.weekNumber) {
        week.addValue(obj.accuracy, obj.win);
        return;
      }
    }

    let newWeek = new Week(obj);
    this.weeks.push(newWeek);
  }

  getData() {
    let winPercentage: WinPercentageData[] = [];
    for (var week of this.weeks){
      winPercentage.push(week.getWinPercentageData());
    }
    return winPercentage;
  }
}
