
export class AccountInfo{
    accountName : string;
    startDate : Date;
    endDate : Date;

    constructor (accountName : string, startDate : Date, endDate : Date){
        this.accountName = accountName;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}