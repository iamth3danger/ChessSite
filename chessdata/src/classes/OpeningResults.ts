import { Opening } from "./Opening";
export class OpeningResults {
    private openings: Opening[] = []

    constructor(){}

    getOpenings(){return this.openings;}

    updateOpeningResults(openingName: string, result: string, subOpening: string){
        for(var opening of this.openings){
            if(opening.getOpeningName() === openingName){
                opening.updateOpeningResults(result);
                opening.updateSubOpening(subOpening);
                return;
            }
        }
        this.addOpening(openingName, result);
    }

    addOpening(openingName: string, result: string){
        this.openings.push(new Opening(openingName, result)); 
    }

}