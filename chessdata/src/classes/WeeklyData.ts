class Week {
  private weekNumber: number;
  private accuracy: number;
  private winPercentage: number;
  private totalGames = 0;

  constructor(weekNumber: number, accuracy: number, win: boolean) {
    this.weekNumber = weekNumber;
    this.accuracy = accuracy;
    this.winPercentage = 0;
    this.setWinPercentage(win);
    this.totalGames++;
  }

  private setWinPercentage(win : boolean){
    let winNumber = win ? 1 : 0;
    this.winPercentage =
      (this.totalGames * this.winPercentage + winNumber) /
      (this.totalGames + 1);
  }

  private setAccuracy(accuracy : number){
    this.accuracy =
      (this.totalGames * this.accuracy + accuracy) / (this.totalGames + 1);
  }

  getWeekNumber(): number {
    return this.weekNumber;
  }

  addValue(accuracy: number, win: boolean) {
    this.setAccuracy(accuracy);  
    this.setWinPercentage(win);
    
    this.totalGames++;
  }
}

export class WeeklyData {
  opening: string;
  weeks: Week[];

  constructor(opening: string) {
    this.opening = opening;
    this.weeks = [];
  }

  addValue(weekNumber: number, accuracy: number, win: boolean) {
    for (var week of this.weeks) {
      if (week.getWeekNumber() === weekNumber) {
        week.addValue(accuracy, win);
        return;
      }
    }

    let newWeek = new Week(weekNumber, accuracy, win);
    this.weeks.push(newWeek);
  }
}
