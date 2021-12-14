import { BuildingCategory } from '../../internal.js';

/**
 * @class
 * @constructor
 */
class BuildingRecipe {

    /**
     * 
     * @param {string} name 
     * @param {Number} time 
     * @param {Number} amount 
     * @param {BuildingCategory} buildingCategory 
     * @param {Array<{amount: Number, resource: string, name: string}>} resourceList 
     */
    constructor(name, time, amount, buildingCategory, resourceList) {
        this.name = name[0].toLowerCase() + name.substring(1, name.length).replace(/\s/i, '');
        this.displayName = name;
        this.time = time;
        this.amount = amount
        this.category = buildingCategory;
        this.resourceList = resourceList;
    }

    GetTotalResourceCost() {
        let total = 0;

        for (let i = 0, l = this.resourceList.length; i < l; ++i) {
            total += this.resourceList[i].amount;
        }

        return total;
    }

    Clone() {
        return new BuildingRecipe(this.name, this.time, this.amount, this.category, JSON.parse(JSON.stringify(this.resourceList)));
    }
}

export { BuildingRecipe };